import argparse
import os
import warnings

# Suppress TensorFlow INFO/WARNING logs
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

# Suppress generic warnings
warnings.filterwarnings("ignore")

import settings
import dataset_manager
import model_prediction_affluence

import threading
import queue
import time

def run_prediction_pipeline(epochs=30, restaurant_id=1):
    """
    Generator that yields status updates during the prediction process.
    Yields dicts with keys: 'status', 'message', 'data'
    """
    msg_queue = queue.Queue()
    
    def on_progress(msg):
        msg_queue.put(msg)
        
    def pipeline_worker():
        try:
            on_progress({"status": "message", "message": "Chargement des données..."})
            
            # 0. Fetch Restaurant Config from DB
            import database_service
            restaurant_config = database_service.service.get_restaurant_config(restaurant_id)
            
            if not restaurant_config:
                 on_progress({"status": "error", "message": f"Restaurant configuration not found for ID {restaurant_id}"})
                 on_progress(None)
                 return

            # Fetch data from DB
            df_history = dataset_manager.manager.load_history_from_db(restaurant_id=restaurant_id)

            # Training
            # The callback inside train_tft_model will use on_progress to send epoch updates
            model, training_dataset = model_prediction_affluence.train_tft_model(
                data=df_history,
                max_epochs=epochs,
                metrics_callback=on_progress
            )
            
            # Prediction
            results_df = model_prediction_affluence.predict_future(
                model, 
                training_dataset, 
                history_df=df_history,
                status_callback=on_progress,
                restaurant_config=restaurant_config
            )
            
            if results_df is not None:
                # Convert Timestamps to string for JSON serialization
                results_df["date"] = results_df["date"].astype(str)
                
                # Convert DataFrame to list of dicts
                json_output = results_df.to_dict(orient="records")
                
                # Yield the final result
                on_progress({"status": "output", "payload": json_output})
                
            on_progress(None) # Sentinel to signal done
            
        except Exception as e:
            on_progress({"status": "error", "message": str(e)})
            on_progress(None)

    # Start the worker thread
    t = threading.Thread(target=pipeline_worker)
    t.start()
    
    # Loop and yield messages from the queue until the thread is done
    while True:
        try:
            # Wait for a message with a timeout to allow checking if thread is alive
            msg = msg_queue.get(timeout=0.1)
            
            if msg is None: # Sentinel
                break
                
            yield msg
            
        except queue.Empty:
            if not t.is_alive():
                break
            # Yield None to allow the caller (server.py) to await asyncio.sleep
            # This prevents blocking the event loop during long training steps
            yield None
    
    t.join()

def main():
    parser = argparse.ArgumentParser(description="Kairoscope Prediction Pipeline")
    parser.add_argument("--epochs", type=int, default=30, help="Number of training epochs")
    parser.add_argument("--restaurant_id", type=int, default=1, help="Restaurant ID to predict for")    
    args = parser.parse_args()
    
    import json
    
    # Iterate over the generator to print to console as before
    for step in run_prediction_pipeline(epochs=args.epochs, restaurant_id=args.restaurant_id):
        if step["status"] == "message":
            print(step["message"])
        elif step["status"] == "steps":
            # Print progress bar style or just the message
            print(f"{step['message']} - {step['step_name']}")
        elif step["status"] == "error":
            print(f"ERROR: {step['message']}")
        elif step["status"] == "output":
            print(json.dumps(step["payload"], indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
