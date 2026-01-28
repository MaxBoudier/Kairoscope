import pandas as pd
import requests
from geopy.geocoders import Nominatim
import settings

# --- 1. Holidays (Jours Fériés) ---
def get_jours_ferie_data(year=2025):
    """
    Returns a DataFrame indexed by date with holiday names.
    """
    api_url = f"https://date.nager.at/api/v3/PublicHolidays/{year}/FR"

    try:
        df_holidays = pd.read_json(api_url)
        if df_holidays.empty:
            return pd.DataFrame()
            
        # Keep only relevant columns
        df_holidays = df_holidays[['date', 'localName']]
        df_holidays['date'] = pd.to_datetime(df_holidays['date'])
        df_holidays = df_holidays.rename(columns={'localName': 'holiday_name'})
        df_holidays = df_holidays.set_index('date')
        df_holidays['is_holiday'] = 1
        return df_holidays
    except Exception as e:
        print(f"[ERROR] Error fetching holidays: {e}")
        return pd.DataFrame()

# --- 2. School Vacations (Vacances Scolaires) ---
def get_vacances_scolaires_data(date_start, date_end, academie="Dijon"):
    """
    Returns a list of vacation dictionaries.
    """
    api_url = "https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-calendrier-scolaire/records"
    
    params = {
        "where": f'location="{academie}" AND end_date >= "{date_start}" AND start_date <= "{date_end}"',
        "limit": 100,
        "order_by": "start_date"
    }

    try:
        response = requests.get(api_url, params=params)
        response.raise_for_status()
        data = response.json()

        vacations = []
        if "results" in data:
            for record in data["results"]:
                start = record.get("start_date")
                end = record.get("end_date")
                description = record.get("description", "Vacances")
                if start and end:
                    start_date = pd.to_datetime(start).tz_localize(None)
                    end_date = pd.to_datetime(end).tz_localize(None)
                    vacations.append({
                        "start_date": start_date, 
                        "end_date": end_date, 
                        "description": description
                    })
        return vacations

    except Exception as e:
        print(f"[ERROR] Error fetching school holidays: {e}")
        return []

# --- 3. Weather (Météo) ---
def get_historical_weather(date_start, date_end, ville):
    '''
    Fetch historical weather data using Open-Meteo API.
    '''
    geolocator = Nominatim(user_agent="meteo_app_kairoscope")
    try:
        location = geolocator.geocode(ville, timeout=10)
    except Exception as e:
        print(f"[ERROR] Geocoding error: {e}")
        return pd.DataFrame()
    
    if location is None:
        print(f"[ERROR] Error fetching location for {ville}")
        return pd.DataFrame()
    
    api_url = "https://archive-api.open-meteo.com/v1/archive"
    
    params = {
        "latitude": location.latitude,
        "longitude": location.longitude,
        "start_date": date_start,
        "end_date": date_end,
        "daily": ["weather_code", "temperature_2m_max", "temperature_2m_min", "precipitation_sum", "wind_speed_10m_max"],
        "timezone": "auto"
    }

    try:
        response = requests.get(api_url, params=params)
        response.raise_for_status()
        data = response.json()
        
        if "daily" not in data:
            return pd.DataFrame()
            
        df = pd.DataFrame(data["daily"])
        
        df = df.rename(columns={
            "time": "date", 
            "temperature_2m_max": "tmax", 
            "temperature_2m_min": "tmin",
            "precipitation_sum": "prcp",
            "wind_speed_10m_max": "wspd"
        })
        
        df["date"] = pd.to_datetime(df["date"])
        df.set_index("date", inplace=True)
        return df

    except Exception as e:
        print(f"[ERROR] Error fetching meteo data: {e}")
        return pd.DataFrame()

def get_weather_forecast(start_date, end_date, lat, lon):
    """Récupère les données météo prévisionnelles via OpenMeteo pour l'intervalle."""
    try:
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": lat,
            "longitude": lon,
            "timezone": "auto",
            "daily": "weather_code,temperature_2m_max,temperature_2m_min",
            "forecast_days": 16
        }
        
        response = requests.get(url, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()
        
        daily = data.get("daily", {})
        times = daily.get("time", [])
        codes = daily.get("weather_code", [])
        temps_max = daily.get("temperature_2m_max", [])
        temps_min = daily.get("temperature_2m_min", [])
        
        weather_map = {}
        for i, date_str in enumerate(times):
            weather_map[date_str] = {
                "code": codes[i],
                "temp_max": temps_max[i],
                "temp_min": temps_min[i],
                "desc": settings.WMO_DESC.get(codes[i], "Météo")
            }
        return weather_map

    except Exception as e:
        print(f"Warning: Weather Forecast unavailable ({e}).")
        return {}
