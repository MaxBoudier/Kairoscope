import argparse
import pandas as pd
import psycopg2
from psycopg2 import sql
import settings
from dataset_manager import manager
import sys
import os

# DB Configuration - Fallback to defaults if not in settings or env
DB_HOST = os.environ.get("DB_HOST", "localhost")
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
        affluence = int(row.get('affluence', 0))
        pourcentage_occupation = int(row.get('occupancy_rate', 0))
        is_complet = bool(row.get('is_full', 0))

        try:
            cursor.execute(query, (
                date_historique, holiday_name, is_holiday, is_school_vacations, vacation_name,
                weather_code, tmax, tmin, prcd, wspd, day_of_week, is_weekend,
                affluence, pourcentage_occupation, is_complet, restaurant_id
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

def get_valid_input(prompt, default_val, type_func=str):
    """Helper to get input with a default value and type conversion."""
    user_input = input(f"{prompt} [{default_val}]: ").strip()
    if not user_input:
        return default_val
    try:
        return type_func(user_input)
    except ValueError:
        print("Invalid input. Using default.")
        return default_val

def main():
    parser = argparse.ArgumentParser(description="Generate and export restaurant history.")
    # Make arguments optional so we can prompt if missing
    parser.add_argument("--restaurant_id", type=int, help="ID of the restaurant")
    parser.add_argument("--start_date", type=str, help="Start date (YYYY-MM-DD)")
    parser.add_argument("--end_date", type=str, help="End date (YYYY-MM-DD)")
    parser.add_argument("--location", type=str, help="Location for weather data")
    parser.add_argument("--max_covers", type=int, help="Maximum number of covers (restaurant size)")
    parser.add_argument("--base_occupancy", type=float, help="Base occupancy rate (0.0 - 1.0)")
    parser.add_argument("--weather_weight", type=float, help="Impact of weather (0.0 - 1.0)")

    args = parser.parse_args()

    # defaults
    default_end_date = datetime.now().strftime("%Y-%m-%d")
    
    # 1. Gather Parameters (Interactive if CLI args missing)
    if args.restaurant_id is None:
        print("\n--- Configuration Interactive ---")
        restaurant_id = get_valid_input("Restaurant ID", 1, int)
        start_date = get_valid_input("Start Date (YYYY-MM-DD)", "2023-01-01")
        end_date = get_valid_input("End Date (YYYY-MM-DD)", default_end_date)
        location = get_valid_input("Location (City)", "Chalon-sur-Saône")
        max_covers = get_valid_input("Max Covers (Size)", settings.DEFAULT_MAX_COVERS, int)
        base_occupancy = get_valid_input("Base Occupancy (0.0-1.0)", settings.DEFAULT_BASE_OCCUPANCY, float)
        weather_weight = get_valid_input("Weather Weight (0.0-1.0)", settings.DEFAULT_WEATHER_WEIGHT, float)
    else:
        # Use provided args or defaults
        restaurant_id = args.restaurant_id
        start_date = args.start_date if args.start_date else "2023-01-01"
        end_date = args.end_date if args.end_date else default_end_date
        location = args.location if args.location else "Chalon-sur-Saône"
        max_covers = args.max_covers if args.max_covers else settings.DEFAULT_MAX_COVERS
        base_occupancy = args.base_occupancy if args.base_occupancy else settings.DEFAULT_BASE_OCCUPANCY
        weather_weight = args.weather_weight if args.weather_weight else settings.DEFAULT_WEATHER_WEIGHT

    print(f"\n--- Generation Parameters ---")
    print(f"Restaurant ID: {restaurant_id}")
    print(f"Period: {start_date} to {end_date}")
    print(f"Location: {location}")
    print(f"Size: {max_covers} covers")
    print(f"Occupancy Base: {base_occupancy}")
    print(f"Weather Weight: {weather_weight}")
    print("-----------------------------\n")

    # 1. Create Base Dataset
    df_base = manager.create_dataset(date_start=start_date, date_end=end_date, location=location)
    
    # 2. Add Affluence
    df_result = manager.calculate_affluence(
        df_input=df_base, 
        max_covers=max_covers,
        base_occupancy=base_occupancy,
        weather_weight=weather_weight
    )
    
    if df_result is None or df_result.empty:
        print("Error: calculate_affluence returned empty or None.")
        sys.exit(1)
        
    # We need 'date' as index for the next lines in generate_history dealing with filtering?
    if 'date' in df_result.columns:
        df_result.set_index('date', inplace=True)
    
    # Filter valid range just in case
    df_result = df_result.loc[start_date:end_date]

    # Export to CSV before DB
    csv_filename = f"history_{restaurant_id}_{start_date}_{end_date}.csv"
    # Save in the same directory as the script or where it's running
    print(f"Exporting history to CSV: {csv_filename}")
    df_result.to_csv(csv_filename)

    # export_to_db(df_result, restaurant_id)

if __name__ == "__main__":
    main()
