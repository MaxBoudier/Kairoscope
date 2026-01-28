import os
from dotenv import load_dotenv

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path)

# --- GLOBAL CONFIGURATION ---

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# API Keys
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

# # Context
# VILLE_CIBLE = "Chalon-sur-Saône"
# ADRESSE_CLIENT = "Rue aux Fèvres, 71100 Chalon-sur-Saône"
# CONTEXTE_URBAIN = "MOYEN"  # DENSE, MOYEN, PERIURBAIN
# TYPE_RESTAURANT = "BRASSERIE"
# # Coordonnées approximatives pour Chalon-sur-Saône
# LATITUDE = 46.7833
# LONGITUDE = 4.85

# # School Academy
# ACADEMIE_SCOLAIRE = "Dijon"

# Simulation Defaults
DEFAULT_MAX_COVERS = 80
DEFAULT_BASE_OCCUPANCY = 0.6
DEFAULT_WEATHER_WEIGHT = 0.3
DEFAULT_DATE_START = "2024-01-01"
DEFAULT_DATE_END = "2026-01-31"

WMO_DESC = {
    0: "Ciel dégagé",
    1: "Principalement dégagé", 2: "Partiellement nuageux", 3: "Couvert",
    45: "Brouillard", 48: "Brouillard givrant",
    51: "Bruine légère", 53: "Bruine modérée", 55: "Bruine dense",
    61: "Pluie légère", 63: "Pluie modérée", 65: "Pluie forte",
    71: "Neige légère", 73: "Neige modérée", 75: "Neige forte",
    77: "Grains de neige",
    80: "Averses de pluie légères", 81: "Averses de pluie modérées", 82: "Averses de pluie violentes",
    85: "Averses de neige légères", 86: "Averses de neige fortes",
    95: "Orage léger ou modéré", 96: "Orage avec grêle légère", 99: "Orage avec grêle forte"
}