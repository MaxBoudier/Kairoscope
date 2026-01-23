import argparse
import pandas as pd
import psycopg2
from psycopg2 import sql
import settings
from dataset_manager import manager
import sys
import os

# DB Configuration - Fallback to defaults if not in settings or env
DB_HOST = os.environ.get("DB_HOST", "kairoscope.maxboudier.fr")
DB_PORT = os.environ.get("DB_PORT", "5432")
DB_NAME = os.environ.get("DB_NAME", "emergency_db")
DB_USER = os.environ.get("DB_USER", "admin")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "admin")

def connect_db():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        sys.exit(1)

def export_to_db(df, restaurant_id):
    conn = connect_db()
    cursor = conn.cursor()
    
    print(f"Exporting {len(df)} rows to database for restaurant_id {restaurant_id}...")

    query = sql.SQL("""
        INSERT INTO historique_affluence (
            date_historique, holiday_name, is_holiday, is_school_vacations, vacation_name,
            weather_code, tmax, tmin, prcd, wspd, day_of_week, is_weekend,
            affluence, pourcentage_occupation, is_complet, restaurant_id
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
        )
    """)

    for index, row in df.iterrows():
        # Map values from DataFrame to DB Schema
        date_historique = index
        holiday_name = row.get('holiday_name') if pd.notna(row.get('holiday_name')) else None
        is_holiday = bool(row.get('is_holiday', 0))
        is_school_vacations = bool(row.get('is_school_vacations', 0))
        vacation_name = row.get('vacation_name') if pd.notna(row.get('vacation_name')) else None
        weather_code = int(row.get('weather_code', 0))
        tmax = int(round(row.get('tmax', 0)))
        tmin = int(round(row.get('tmin', 0)))
        prcd = int(round(row.get('prcp', 0))) # Note: prcp vs prcd in generated dataframe vs db
        wspd = int(round(row.get('wspd', 0)))
        day_of_week = row.get('day_of_week')
        is_weekend = bool(row.get('is_weekend', 0))
        influence = int(row.get('affluence', 0))
        pourcentage_occupation = int(row.get('occupancy_rate', 0))
        is_complet = bool(row.get('is_full', 0))

        try:
            cursor.execute(query, (
                date_historique, holiday_name, is_holiday, is_school_vacations, vacation_name,
                weather_code, tmax, tmin, prcd, wspd, day_of_week, is_weekend,
                influence, pourcentage_occupation, is_complet, restaurant_id
            ))
        except Exception as e:
            print(f"Error inserting row {index}: {e}")
            conn.rollback()
            continue

    conn.commit()
    cursor.close()
    conn.close()
    print("Export complete.")

from datetime import datetime

def main():
    parser = argparse.ArgumentParser(description="Generate and export restaurant history.")
    parser.add_argument("--restaurant_id", type=int, required=True, help="ID of the restaurant")
    parser.add_argument("--start_date", type=str, required=True, help="Start date (YYYY-MM-DD)")
    parser.add_argument("--end_date", type=str, required=False, help="End date (YYYY-MM-DD). Defaults to today if not provided.")

    args = parser.parse_args()

    # Default end_date to today if not provided
    end_date = args.end_date
    if not end_date:
        end_date = datetime.now().strftime("%Y-%m-%d")
        print(f"No end_date provided. Using today's date: {end_date}")

    # Generate Data
    # 1. Create base dataset (Weather, Holidays)
    manager.create_dataset(date_start=args.start_date, date_end=end_date)
    
    # 2. Calculate Affluence (Features + Target)
    # Using a temporary file for this specific generation or overriding default?
    # For simplicity, we assume calculate_affluence uses the just created 'dpd_dataset.csv'
    # and we can read the result from the default output or specify one.
    # The manager methods save to files defined in settings. We will read the resulting dataframe.
    
    # 2. Calculate Affluence (Features + Target)
    df_result = manager.calculate_affluence()
    
    if df_result is None or df_result.empty:
        print("Error: calculate_affluence returned empty or None.")
        sys.exit(1)

    # Ensure date is index for filtering if needed, but calculate_affluence returns date as column usually or index?
    # dataset_manager.py says: return df[output_columns].reset_index() -> date is a column (if it was index) or implies index is default range?
    # Actually create_dataset sets index names "date". calculate_affluence resets it at the end?
    # Line 249: return df[output_columns].reset_index()
    # So 'date' (the index) becomes a column 'date' (if named) or 'index'. 
    # create_dataset: df_main.index.name = "date"
    # So reset_index() makes 'date' a column.
    
    # We need 'date' as index for the next lines in generate_history dealing with filtering?
    if 'date' in df_result.columns:
        df_result.set_index('date', inplace=True)
    
    # Filter valid range just in case
    df_result = df_result.loc[args.start_date:end_date]

    export_to_db(df_result, args.restaurant_id)

if __name__ == "__main__":
    main()
