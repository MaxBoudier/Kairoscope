import pandas as pd
import numpy as np
import os
import settings
import data_providers
import sip_engine
import psycopg2
import sys
import warnings

# Suppress specific SQLAlchemy UserWarning
warnings.filterwarnings("ignore", ".*pandas only supports SQLAlchemy connection.*")


class DatasetManager:
    def __init__(self):
        pass

    def add_sip_features(self, df):
        """
        Adds SIP (Score d'Impact Pondéré) features to the dataframe.
        """
        # Base SIP
        day_map_en_to_sip = {
            'monday': 0.1, 'tuesday': 0.1, 'wednesday': 0.2, 'thursday': 0.3,
            'friday': 0.4, 'saturday': 0.5, 'sunday': 0.2
        }
        df['sip_base'] = df['day_of_week'].map(day_map_en_to_sip).fillna(0.1)
        
        # Event SIP
        # Ensure columns exist and fillna if needed
        if 'is_holiday' not in df.columns: df['is_holiday'] = 0
        if 'is_school_vacations' not in df.columns: df['is_school_vacations'] = 0

        df['sip_event'] = 0.0
        df.loc[df['is_holiday'] == 1, 'sip_event'] += 0.6
        df.loc[df['is_school_vacations'] == 1, 'sip_event'] += 0.2
        
        # Random Local Events
        random_events = np.random.choice([0, 0.15], size=len(df), p=[0.9, 0.1])
        df['sip_event'] += random_events
        
        # Weather Impact on SIP
        # Reconstruct weather_score if missing
        if 'weather_score' not in df.columns:
            # Need to recalc weather score if not present
            optimal_temp = 22.0
            if 'tmax' not in df.columns: df['tmax'] = 20
            if 'prcp' not in df.columns: df['prcp'] = 0
            if 'wspd' not in df.columns: df['wspd'] = 10

            temp_diff = abs(df['tmax'] - optimal_temp)
            temp_mod = 1.0 - (temp_diff / 30.0)
            temp_mod = temp_mod.clip(0.5, 1.2)
            
            rain_mod = 1.0 - (df['prcp'].clip(0, 20) / 40.0)
            wind_mod = 1.0 - (df['wspd'].clip(0, 60) / 100.0)
            
            df['weather_score'] = (temp_mod + rain_mod + wind_mod) / 3.0

        df.loc[df['weather_score'] < 0.8, 'sip_event'] *= 0.7
        
        df['sip'] = df['sip_base'] + df['sip_event']
        return df

    def create_dataset(self, date_start=settings.DEFAULT_DATE_START, date_end=settings.DEFAULT_DATE_END):
        """
        Creates the base DPD dataset merging Holidays, Vacations, and Weather.
        Returns a DataFrame.
        """
        print(f"--- Creating Dataset ({date_start} to {date_end}) ---")
        
        # 1. Master Date Index
        dates = pd.date_range(start=date_start, end=date_end)
        df_main = pd.DataFrame(index=dates)
        df_main.index.name = "date"

        # 2. Fetch Data
        print("Fetching Holidays...")
        df_holidays = data_providers.get_jours_ferie_data()
        
        print("Fetching School Vacations...")
        vacations_list = data_providers.get_vacances_scolaires_data(date_start, date_end)
        
        print("Fetching Weather...")
        df_meteo = data_providers.get_historical_weather(date_start, date_end)

        # 3. Merge Data
        
        # Merge Holidays
        if not df_holidays.empty:
            df_main = df_main.join(df_holidays, how='left')
            df_main['is_holiday'] = df_main['is_holiday'].fillna(0).astype(int)
            df_main['holiday_name'] = df_main['holiday_name'].fillna("None")
        else:
            df_main['is_holiday'] = 0
            df_main['holiday_name'] = "None"

        # Merge School Vacations
        df_main['is_school_vacations'] = 0
        df_main['vacation_name'] = "None"

        for v in vacations_list:
            mask = (df_main.index >= v['start_date']) & (df_main.index <= v['end_date'])
            df_main.loc[mask, 'is_school_vacations'] = 1
            df_main.loc[mask, 'vacation_name'] = v['description']

        # Merge Weather
        if not df_meteo.empty:
            df_main = df_main.join(df_meteo, how='left')
        
        # 4. Compute Features
        df_main["day_of_week"] = df_main.index.day_name().str.lower()
        df_main["is_weekend"] = df_main.index.dayofweek.isin([5, 6]).astype(int)

        # 5. Cleanup
        # Fill missing weather with averages
        for col in ['tmax', 'tmin', 'wspd']:
            if col in df_main.columns:
                 df_main[col] = df_main[col].fillna(df_main[col].mean())
        
        if 'prcp' in df_main.columns:
            df_main['prcp'] = df_main['prcp'].fillna(0)
        
        if 'weather_code' in df_main.columns:
            df_main['weather_code'] = df_main['weather_code'].fillna(0)

        # Return df directly
        return df_main

    def calculate_affluence(self, 
                            df_input=None, 
                            max_covers=settings.DEFAULT_MAX_COVERS,
                            base_occupancy=settings.DEFAULT_BASE_OCCUPANCY,
                            weather_weight=settings.DEFAULT_WEATHER_WEIGHT):
        """
        Generates synthetic affluence (ground truth) and SIP feature.
        Takes optional input DataFrame (if provided) or creates one via create_dataset.
        Returns the enhanced DataFrame.
        """
        print(f"--- Generating Affluence ---")
        
        if df_input is None:
            print("No input df provided. Creating dataset first...")
            df = self.create_dataset()
        else:
            df = df_input.copy()
            # Ensure index is datetime if it's not already
            if not isinstance(df.index, pd.DatetimeIndex):
                if 'date' in df.columns:
                    df['date'] = pd.to_datetime(df['date'])
                    df.set_index('date', inplace=True)
        
        # 0. Static
        df['restaurant_id'] = "1"

        # 1. Base Affluence (Day Weights)
        # Using English keys from helper in settings/sip_engine
        df['day_weight'] = df['day_of_week'].map(sip_engine.DAY_WEIGHTS_EN).fillna(1.0)

        # --- Calculation Improvements for "Interestingness" ---

        # 1. Seasonality (Annual Cycle)
        # Peak in late spring/early summer (Day ~160) and December (Day ~350)
        day_of_year = df.index.dayofyear
        # Sinusoidal wave: period 365 days, amplitude 0.2, shifted to peak around day 160 (June)
        df['seasonality_mod'] = 1.0 + 0.15 * np.sin(2 * np.pi * (day_of_year - 160) / 365.25)
        # Add boost for December (Festive season)
        df.loc[df.index.month == 12, 'seasonality_mod'] += 0.15
        # Slight dip in January/February
        df.loc[df.index.month <= 2, 'seasonality_mod'] -= 0.05

        # 2. Payday Effect (Start/End of Month)
        # Boost for first 5 days and last 3 days of the month
        df['payday_mod'] = 1.0
        df.loc[(df.index.day >= 28) | (df.index.day <= 5), 'payday_mod'] = 1.1

        # 3. Dynamic Holiday/Vacation Modifiers
        # Instead of flat values, add some randomness to simulate events being hit or miss
        df['holiday_mod'] = df['is_holiday'].apply(lambda x: np.random.uniform(1.2, 1.5) if x == 1 else 1.0)
        # School vacations usually mean slightly less business for business districts, 
        # or more for touristy. Let's assume slight boost (touristy/family) but variable.
        df['vacation_mod'] = df['is_school_vacations'].apply(lambda x: np.random.uniform(1.0, 1.2) if x == 1 else 1.0)

        # 4. Long-term Trend (Linear growth)
        # Simulate a restaurant gaining popularity over time (e.g. 5% growth per year)
        days_from_start = (df.index - df.index[0]).days
        df['trend_mod'] = 1.0 + (days_from_start / 365.0) * 0.05

        # 5. Weather Mod (More Complex Interaction)
        optimal_temp = 22.0
        df['temp_diff'] = abs(df['tmax'] - optimal_temp)
        df['temp_mod'] = 1.0 - (df['temp_diff'] / 35.0)
        df['temp_mod'] = df['temp_mod'].clip(0.4, 1.2)
        
        # Rain impacts weekends more heavily (leisure dining vs necessary workday lunch)
        df['rain_impact'] = df['prcp'].clip(0, 30) / 50.0 # 0 to ~0.6
        # Weekday rain penalty: normal
        # Weekend rain penalty: 1.5x
        df['rain_sensitivity'] = df['is_weekend'].apply(lambda x: 1.5 if x == 1 else 1.0)
        df['rain_mod'] = 1.0 - (df['rain_impact'] * df['rain_sensitivity'])
        
        df['wind_mod'] = 1.0 - (df['wspd'].clip(0, 60) / 120.0)
        
        df['weather_score'] = (df['temp_mod'] * 0.5 + df['rain_mod'] * 0.3 + df['wind_mod'] * 0.2)
        df['weather_factor'] = 1.0 + weather_weight * (df['weather_score'] - 1.0)

        # 6. Final Demand Calculation
        base_count = max_covers * base_occupancy
        
        df['raw_demand'] = (
            base_count * 
            df['day_weight'] * 
            df['holiday_mod'] * 
            df['vacation_mod'] * 
            df['weather_factor'] *
            df['seasonality_mod'] *
            df['payday_mod'] * 
            df['trend_mod']
        )

        # 7. Targeted Noise
        # Busy days have more variance than quiet days (Heteroscedasticity)
        # Sigma is 15% of the raw demand
        noise = np.random.normal(0, 0.15, size=len(df))
        df['raw_demand'] = df['raw_demand'] * (1 + noise)

        # 8. Clip and Finalize
        df['affluence'] = df['raw_demand'].round().astype(int).clip(0, max_covers)
        df['occupancy_rate'] = (df['affluence'] / max_covers * 100).round(1)
        df['is_full'] = (df['affluence'] == max_covers).astype(int)

        df = self.add_sip_features(df)

        # 9. Return (Restrict to original columns only)
        output_columns = [
            'restaurant_id', 'day_of_week', 'is_weekend',
            'is_holiday', 'holiday_name', 'is_school_vacations', 'vacation_name',
            'tmax', 'tmin', 'prcp', 'wspd', 'weather_code',
            'sip', 'affluence', 'occupancy_rate', 'is_full'
        ]
        
        # Ensure all exist
        for col in output_columns:
            if col not in df.columns:
                df[col] = 0
                
        # Return dataframe
        return df[output_columns].reset_index()

    def load_history_from_db(self, restaurant_id):
        """
        Loads history data directly from the PostgreSQL database.
        Returns a DataFrame formatted for the model.
        """
        print(f"--- Loading History from DB for Restaurant {restaurant_id} ---")

        # DB Config from env or defaults
        db_host = os.environ.get("DB_HOST", "localhost")
        db_port = os.environ.get("DB_PORT", "5432")
        db_name = os.environ.get("DB_NAME", "emergency_db")
        db_user = os.environ.get("DB_USER", "admin")
        db_password = os.environ.get("DB_PASSWORD", "admin")

        try:
            conn = psycopg2.connect(
                host=db_host,
                port=db_port,
                dbname=db_name,
                user=db_user,
                password=db_password
            )
        except Exception as e:
            print(f"Error connecting to database: {e}")
            sys.exit(1)

        query = f"""
            SELECT date_historique, holiday_name, is_holiday, is_school_vacations, vacation_name,
                   weather_code, tmax, tmin, prcd as prcp, wspd, day_of_week, is_weekend,
                   affluence, pourcentage_occupation as occupancy_rate, is_complet as is_full, restaurant_id
            FROM historique_affluence
            WHERE restaurant_id = {restaurant_id}
            ORDER BY date_historique ASC
        """
        
        df = pd.read_sql_query(query, conn)
        conn.close()

        # Post-processing to match expected format
        df['date'] = pd.to_datetime(df['date_historique'])
        df = df.set_index('date')
        df.drop(columns=['date_historique'], inplace=True)
        
        # Ensure unique index (handle existing duplicates in DB)
        df = df[~df.index.duplicated(keep='last')]
        
        # Reset index to allow it to be a column again if needed by caller, 
        # BUT wait, the model expects 'date' column.
        # Let's RETURN it with 'date' as a column, not index.
        df.reset_index(inplace=True)

        # Calculate SIP features (not in DB)
        df = self.add_sip_features(df)

        print(f"Loaded {len(df)} rows from database.")
        return df

# Singleton
manager = DatasetManager()
