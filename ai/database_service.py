import os
import psycopg2
import pandas as pd
from geopy.geocoders import Nominatim
import sys

# Singleton implementation for DB Service
class DatabaseService:
    def __init__(self):
        self.db_host = os.environ.get("DB_HOST", "localhost")
        self.db_port = os.environ.get("DB_PORT", "5432")
        self.db_name = os.environ.get("DB_NAME", "emergency_db")
        self.db_user = os.environ.get("DB_USER", "admin")
        self.db_password = os.environ.get("DB_PASSWORD", "admin")
        self._conn = None

    def get_connection(self):
        try:
            conn = psycopg2.connect(
                host=self.db_host,
                port=self.db_port,
                dbname=self.db_name,
                user=self.db_user,
                password=self.db_password
            )
            return conn
        except Exception as e:
            print(f"Error connecting to database: {e}")
            return None

    def get_restaurant_config(self, restaurant_id):
        """
        Fetches restaurant details from DB and supplements missing fields with defaults/geocoding.
        Returns a dictionary.
        """
        conn = self.get_connection()
        if not conn:
            return None
        
        try:
            cur = conn.cursor()
            query = """
                SELECT id, nom, ville, adresse, code_postal, type_restaurant 
                FROM restaurant 
                WHERE id = %s
            """
            cur.execute(query, (restaurant_id,))
            row = cur.fetchone()
            
            if not row:
                print(f"Restaurant {restaurant_id} not found.")
                return None
                
            config = {
                "id": row[0],
                "name": row[1],
                "city": row[2],
                "address_street": row[3],
                "zip_code": row[4],
                "type_restaurant": row[5] or "BRASSERIE", # Default if null
            }
            
            # Derived fields
            config["full_address"] = f"{config['address_street']}, {config['zip_code']} {config['city']}"
            config["urban_context"] = "MOYEN" # Default as column missing in DB
            config["academy"] = "Dijon" # Default as column missing in DB
            
            # Geocoding for Lat/Lon
            # We can try to geocode the city to get approx coords if needed
            # Or use the specific variables if they were columns
            geolocator = Nominatim(user_agent="kairoscope_app_v1")
            try:
                # Try full address first
                location = geolocator.geocode(config["full_address"], timeout=5)
                if not location:
                    # Fallback to city
                    location = geolocator.geocode(config["city"], timeout=5)
                
                if location:
                    config["latitude"] = location.latitude
                    config["longitude"] = location.longitude
                else:
                    # Fallback defaults (Chalon)
                    config["latitude"] = 46.7833
                    config["longitude"] = 4.85
            except Exception as e:
                print(f"Geocoding failed: {e}")
                config["latitude"] = 46.7833
                config["longitude"] = 4.85
                
            return config
            
        except Exception as e:
            print(f"Error fetching restaurant config: {e}")
            return None
        finally:
            conn.close()

    def load_history_from_db(self, restaurant_id):
        """
        Loads history data directly from the PostgreSQL database.
        Returns a DataFrame formatted for the model.
        MOVED from dataset_manager.py
        """
        print(f"--- Loading History from DB for Restaurant {restaurant_id} ---")
        
        conn = self.get_connection()
        if not conn:
            sys.exit(1)

        query = f"""
            SELECT date_historique, holiday_name, is_holiday, is_school_vacations, vacation_name,
                   weather_code, tmax, tmin, prcp, wspd, day_of_week, is_weekend,
                   affluence,  occupancy_rate,  is_full, restaurant_id
            FROM historique_affluence
            WHERE restaurant_id = {restaurant_id}
            ORDER BY date_historique ASC
        """
        
        try:
            df = pd.read_sql_query(query, conn)
            
            # Post-processing to match expected format
            df['date'] = pd.to_datetime(df['date_historique'])
            df = df.set_index('date')
            df.drop(columns=['date_historique'], inplace=True)
            
            # Ensure unique index (handle existing duplicates in DB)
            df = df[~df.index.duplicated(keep='last')]
            
            # Reset index to return 'date' as a column
            df.reset_index(inplace=True)
            
            print(f"Loaded {len(df)} rows from database.")
            return df
            
        except Exception as e:
            print(f"Error reading history: {e}")
            return pd.DataFrame()
        finally:
            conn.close()

# Expose a singleton
service = DatabaseService()
