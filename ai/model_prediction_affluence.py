
import os
import pandas as pd
import numpy as np
import torch
import lightning.pytorch as pl
from pytorch_forecasting import TimeSeriesDataSet, TemporalFusionTransformer, Baseline, QuantileLoss
from pytorch_forecasting.data import GroupNormalizer, NaNLabelEncoder
from lightning.pytorch.callbacks import EarlyStopping, LearningRateMonitor
from lightning.pytorch.loggers import TensorBoardLogger
import logging
import warnings

# Reduce logging noise
logging.getLogger("lightning.pytorch").setLevel(logging.ERROR)
logging.getLogger("pytorch_forecasting").setLevel(logging.ERROR)
warnings.filterwarnings("ignore")

import settings
import dataset_manager
import gemini_service

def train_tft_model(data=None, max_epochs=30, metrics_callback=None):
    """
    Trains a Temporal Fusion Transformer model on the provided data.
    metrics_callback: function that accepts a dict (for epoch progress)
    """
    
    # --- 1. Load & Preprocess Data ---
    if data is None:
        raise ValueError("Data must be provided as a DataFrame.")
        
    data["date"] = pd.to_datetime(data["date"])
    
    # Create time_idx
    min_date = data["date"].min()
    data["time_idx"] = (data["date"] - min_date).dt.days
    
    # Ensure types are correct
    data["restaurant_id"] = data["restaurant_id"].astype(str)
    data["day_of_week"] = data["day_of_week"].astype(str)
    data["is_holiday"] = data["is_holiday"].astype(str)
    data["is_school_vacations"] = data["is_school_vacations"].astype(str)
    
    # Cast to float
    data["affluence"] = data["affluence"].astype(float)
    data["sip"] = data["sip"].astype(float)
    data["tmax"] = data["tmax"].astype(float)
    data["prcp"] = data["prcp"].astype(float)
    
    # Handle infinite and missing
    data = data.replace([np.inf, -np.inf], np.nan)
    data = data.fillna(0)

    print(f"Training data range: {data['date'].min()} to {data['date'].max()}")
    
    # --- 2. Define Dataset ---
    
    max_prediction_length = 16
    max_encoder_length = 60 # Look back context reduced
    training_cutoff = data["time_idx"].max() - max_prediction_length
    
    # Define custom callback for progress
    early_stop_callback = EarlyStopping(monitor="val_loss", min_delta=1e-4, patience=10, verbose=False, mode="min")
    
    callbacks_list = [
        early_stop_callback,
        LearningRateMonitor()
    ]
    
    if metrics_callback:
        class WebsocketProgressCallback(pl.Callback):
            def on_train_epoch_end(self, trainer, pl_module):
                # Calculate progress
                current_epoch = trainer.current_epoch + 1
                total_epochs = trainer.max_epochs
                
                # Check EarlyStopping state to provide a dynamic target
                # If we are waiting for improvement, the max likely epoch is current + remaining patience
                patience = early_stop_callback.patience
                wait_count = early_stop_callback.wait_count
                
                # If wait_count > 0, we are effectively counting down to a potential early stop
                if wait_count > 0:
                    # PROJECTED END = Current + (Patience - Waited)
                    # e.g. Current=15, Patience=10, Waited=3 (7 left). Projected = 22.
                    projected_end = current_epoch + (patience - wait_count)
                    total_epochs = min(total_epochs, projected_end)
                
                # Ensure we handle the actual stop correctly too
                if trainer.should_stop:
                    total_epochs = current_epoch
                
                # Construct the JSON-like dict the user requested
                msg = {
                    "status": "steps",
                    "message": "Affinement du modèle Kairoscope en cours...",
                    "step_name": f"Etape {current_epoch} sur {total_epochs}",
                    "step": current_epoch,
                    "total_step": total_epochs
                }
                metrics_callback(msg)
                
        callbacks_list.append(WebsocketProgressCallback())

    training = TimeSeriesDataSet(
        data[lambda x: x.time_idx <= training_cutoff],
        time_idx="time_idx",
        target="affluence",
        group_ids=["restaurant_id"],
        min_encoder_length=max_encoder_length // 2,
        max_encoder_length=max_encoder_length,
        min_prediction_length=1,
        max_prediction_length=max_prediction_length,
        static_categoricals=["restaurant_id"],
        time_varying_known_categoricals=["day_of_week", "is_holiday", "is_school_vacations"],
        categorical_encoders={
            "is_holiday": NaNLabelEncoder(add_nan=True),
            "is_school_vacations": NaNLabelEncoder(add_nan=True),
        },
        time_varying_known_reals=["time_idx", "tmax", "prcp", "sip"],
        time_varying_unknown_reals=["affluence"],
        target_normalizer=GroupNormalizer(
            groups=["restaurant_id"], transformation="softplus"
        ), 
        add_relative_time_idx=True,
        add_target_scales=True,
        add_encoder_length=True,
        allow_missing_timesteps=True
    )

    validation = TimeSeriesDataSet.from_dataset(training, data, predict=True, stop_randomization=True)

    batch_size = 32
    train_dataloader = training.to_dataloader(train=True, batch_size=batch_size, num_workers=0)
    val_dataloader = validation.to_dataloader(train=False, batch_size=batch_size * 10, num_workers=0)

    # --- 3. Define Model ---
    
    pl.seed_everything(42)
    trainer = pl.Trainer(
        max_epochs=max_epochs,
        accelerator="auto", 
        devices=1,
        gradient_clip_val=0.1,
        limit_train_batches=30,
        callbacks=callbacks_list,
    )

    tft = TemporalFusionTransformer.from_dataset(
        training,
        learning_rate=0.03,
        hidden_size=16,
        attention_head_size=1,
        dropout=0.1,
        hidden_continuous_size=8,
        output_size=7,
        loss=QuantileLoss(),
        log_interval=10,
        reduce_on_plateau_patience=4,
    )

    # --- 4. Train ---
    print("Starting Training...")
    trainer.fit(
        tft,
        train_dataloaders=train_dataloader,
        val_dataloaders=val_dataloader,
    )

    best_model_path = trainer.checkpoint_callback.best_model_path
    print(f"Best model saved at: {best_model_path}")
    print("Using final model state.")
    return tft, training


def predict_future(model, training_dataset, history_df=None, status_callback=None, restaurant_config=None):
    """
    Uses the trained model to predict the next 16 days.
    Fetches future features via Gemini/Weather.
    """
    # 1. Load History
    if history_df is None:
        raise ValueError("history_df must be provided.")
        
    history = history_df.copy()
    history["date"] = pd.to_datetime(history["date"])
    min_date = history["date"].min()
    last_date = history["date"].max()
    
    # 2. Get Future Data (Gemini + Weather)
    start_future = (last_date + pd.Timedelta(days=1)).strftime("%Y-%m-%d")
    end_future = (last_date + pd.Timedelta(days=16)).strftime("%Y-%m-%d")
    
    print(f"Fetching future data from {start_future} to {end_future}...")
    
    if status_callback:
        status_callback({
            "status": "message",
            "message": "Recherche des conditions et événements futurs..."
        })
    
    # USE NEW SERVICE
    if restaurant_config is None:
        # Fallback if somehow not provided (though main.py should provide it)
        # This prevents hard crash but might lead to poor results if defaults aren't enough
        restaurant_config = {"latitude": 46.7833, "longitude": 4.85}

    future_list = gemini_service.get_future_data(date_debut=start_future, date_fin=end_future, restaurant_config=restaurant_config)

    if not future_list:
        print("[ERROR] No future data returned.")
        return

    # 3. Format Future Data
    future_df = pd.DataFrame(future_list)
    
    future_df["date"] = pd.to_datetime(future_df["date"])
    future_df["time_idx"] = (future_df["date"] - min_date).dt.days
    future_df["restaurant_id"] = "1"
    future_df["affluence"] = 0.0 
    
    # Map Day of Week Gemini (French) -> English
    day_map = {
        "LUNDI": "monday", "MARDI": "tuesday", "MERCREDI": "wednesday",
        "JEUDI": "thursday", "VENDREDI": "friday", "SAMEDI": "saturday", "DIMANCHE": "sunday"
    }
    future_df["day_of_week"] = future_df["day_of_week"].map(day_map).fillna(future_df["day_of_week"])
    
    # New Service might return SIP directly, but we need is_holiday etc.
    # For now we assume defaults for future if not explicitly returned in the simple list
    future_df["is_holiday"] = 0 
    future_df["is_school_vacations"] = 0
    future_df["prcp"] = 0.0
    
    future_df["is_holiday"] = future_df["is_holiday"].astype(int).astype(str)
    future_df["is_school_vacations"] = future_df["is_school_vacations"].astype(int).astype(str)
    future_df["day_of_week"] = future_df["day_of_week"].astype(str)
    
    future_df["affluence"] = future_df["affluence"].astype(float)
    future_df["sip"] = future_df["sip"].astype(float)
    future_df["tmax"] = future_df["tmax"].astype(float)
    future_df["prcp"] = future_df["prcp"].astype(float)

    # 4. Merge
    context_df = history.tail(400).copy()
    context_df["restaurant_id"] = context_df["restaurant_id"].astype(str)
    context_df["day_of_week"] = context_df["day_of_week"].astype(str)
    context_df["is_holiday"] = context_df["is_holiday"].astype(str)
    context_df["is_school_vacations"] = context_df["is_school_vacations"].astype(str)
    context_df["time_idx"] = (context_df["date"] - min_date).dt.days
    
    cols = ["time_idx", "date", "restaurant_id", "day_of_week", "is_holiday", 
            "is_school_vacations", "tmax", "prcp", "sip", "affluence"]
    
    combined = pd.concat([context_df[cols], future_df[cols]], ignore_index=True)
    combined = combined.sort_values(["restaurant_id", "date"]).reset_index(drop=True)
    combined["time_idx"] = range(len(combined))
    
    # --- 5. Predict (Standard Kairoscope) ---
    print("Generating predictions (Kairoscope)...")
    
    new_prediction_data = combined
    raw_predictions = model.predict(new_prediction_data, mode="raw", return_x=True)
    
    preds = raw_predictions.output.prediction[0] 
    median_preds = preds[:, 3].detach().cpu().numpy()
    lower_preds = preds[:, 1].detach().cpu().numpy()
    upper_preds = preds[:, 5].detach().cpu().numpy()

    # --- 6. Predict (Non-Kairoscope / Baseline) ---
    print("Generating predictions (Non-Kairoscope)...")
    
    # Create baseline future data with SIP=0
    future_df_no_kairo = future_df.copy()
    future_df_no_kairo["sip"] = 0.0
    
    # Merge for baseline
    combined_no_kairo = pd.concat([context_df[cols], future_df_no_kairo[cols]], ignore_index=True)
    combined_no_kairo = combined_no_kairo.sort_values(["restaurant_id", "date"]).reset_index(drop=True)
    combined_no_kairo["time_idx"] = range(len(combined_no_kairo))
    
    # Predict baseline
    raw_predictions_no_kairo = model.predict(combined_no_kairo, mode="raw", return_x=True)
    preds_no_kairo = raw_predictions_no_kairo.output.prediction[0]
    
    median_preds_no_kairo = preds_no_kairo[:, 3].detach().cpu().numpy()
    lower_preds_no_kairo = preds_no_kairo[:, 1].detach().cpu().numpy()
    upper_preds_no_kairo = preds_no_kairo[:, 5].detach().cpu().numpy()
    
    # --- 7. Compile Results ---
    results_df = future_df[["date", "day_of_week", "tmax", "sip"]].copy()
    
    if "events" in future_df.columns:
        results_df["events"] = future_df["events"].values
    else:
        results_df["events"] = [[] for _ in range(len(results_df))]
        
    # Kairoscope Results
    results_df["predicted_affluence"] = median_preds
    results_df["conf_low"] = lower_preds
    results_df["conf_high"] = upper_preds
    
    # Non-Kairoscope Results
    results_df["predicted_affluence_no_kairo"] = median_preds_no_kairo
    results_df["conf_low_no_kairo"] = lower_preds_no_kairo
    results_df["conf_high_no_kairo"] = upper_preds_no_kairo
    
    # Clip confidence bounds to 0
    results_df["conf_low"] = results_df["conf_low"].clip(lower=0)
    results_df["conf_high"] = results_df["conf_high"].clip(lower=0)
    results_df["conf_low_no_kairo"] = results_df["conf_low_no_kairo"].clip(lower=0)
    results_df["conf_high_no_kairo"] = results_df["conf_high_no_kairo"].clip(lower=0)
    
    # Calculate Uncertainty Metrics (based on Kairoscope prediction)
    results_df["uncertainty_range"] = results_df["conf_high"] - results_df["conf_low"]
    
    # Relative uncertainty (avoid division by zero)
    results_df["relative_uncertainty"] = 0.0
    mask = results_df["predicted_affluence"] > 0.1
    results_df.loc[mask, "relative_uncertainty"] = (
        results_df.loc[mask, "uncertainty_range"] / results_df.loc[mask, "predicted_affluence"]
    )
    
    def get_confidence_score(rel_unc):
        if rel_unc < 0.30: return "High"
        if rel_unc < 0.60: return "Medium"
        return "Low"
        
    results_df["confidence_score"] = results_df["relative_uncertainty"].apply(get_confidence_score)

    print("\n" + "="*40)
    print(f"PREDICTIONS ({start_future} - {end_future})")
    print("="*40)
    print(results_df[["date", "day_of_week", "predicted_affluence", "predicted_affluence_no_kairo", "confidence_score"]])
    
    # No longer saving to CSV
    # results_df.to_csv(settings.PREDICTIONS_FILE_PATH, index=False)
    # print(f"Saved to {settings.PREDICTIONS_FILE_PATH}")
    return results_df

if __name__ == "__main__":
    print("Please use main.py to run this logic.")
