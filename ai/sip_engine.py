import math
from math import exp

# --- CONSTANTS ---

IMPACT_BASE_JOUR = {
    "LUNDI": 0.1, "MARDI": 0.1, "MERCREDI": 0.2, "JEUDI": 0.3,
    "VENDREDI": 0.4, "SAMEDI": 0.5, "DIMANCHE": 0.2
}

# English map for internal dataset consistency
DAY_WEIGHTS_EN = {
    'monday': 0.7,
    'tuesday': 0.8,
    'wednesday': 0.9,
    'thursday': 0.95,
    'friday': 1.2,
    'saturday': 1.3,
    'sunday': 1.1
}

WMO_DESC = {
    0: "Ciel clair", 1: "Principalement clair", 2: "Partiellement nuageux", 3: "Couvert",
    45: "Brouillard", 48: "Brouillard givrant",
    51: "Bruine légère", 53: "Bruine modérée", 55: "Bruine dense",
    61: "Pluie faible", 63: "Pluie modérée", 65: "Pluie forte",
    67: "Neige faible", 71: "Neige faible", 73: "Neige modérée", 75: "Neige forte",
    80: "Averses de pluie faibles", 81: "Averses de pluie modérées", 82: "Averses de pluie violentes",
    95: "Orage", 96: "Orage avec grêle légère", 99: "Orage avec grêle forte"
}

# --- FUNCTIONS ---

def calcul_impact_distance(impact_base, distance_metres, contexte_urbain):
    """Calculates impact decay based on distance and urban context."""
    if contexte_urbain == "DENSE": 
        if distance_metres < 100: return impact_base * 1.5 
        elif distance_metres < 300: return impact_base * 1.0 
        elif distance_metres < 700: return impact_base * 0.4
        else: return impact_base * 0.1 * exp(-(distance_metres - 700) / 300)
    elif contexte_urbain == "MOYEN": 
        if distance_metres < 200: return impact_base * 1.3
        elif distance_metres < 500: return impact_base * 1.0
        elif distance_metres < 1000: return impact_base * 0.5
        else: return impact_base * 0.15 * exp(-(distance_metres - 1000) / 400)
    else: # PERIURBAIN / RURAL
        if distance_metres < 300: return impact_base * 1.2
        elif distance_metres < 800: return impact_base * 1.0
        elif distance_metres < 2000: return impact_base * 0.6
        else: return impact_base * 0.2 * exp(-(distance_metres - 2000) / 800)

def get_impact_base(categorie_evenement, moment_impact, contexte_urbain, type_resto):
    """Returns the base impact score for a given event category."""
    # Simplified simulation logic matching original script
    
    if categorie_evenement == "CONCERT" and moment_impact == "soir_pre":
        if contexte_urbain == "DENSE": return 0.35
        if contexte_urbain == "MOYEN": return 0.25

    if categorie_evenement == "SPORT": return 0.20
    if categorie_evenement == "CULTURE": return 0.15
    
    if categorie_evenement == "FETE" or categorie_evenement == "SPECIAL": 
        return 0.60
        
    if categorie_evenement == "BUSINESS": 
        return 0.10 if moment_impact == "midi" else 0.05
    
    return 0.10 # Default fallback

def get_weather_event_modifier(w_code, type_lieu):
    """Modifies event impact based on weather conditions and venue type."""
    if not type_lieu or type_lieu.upper() == "INTERIEUR":
        return 1.0
    
    if type_lieu.upper() == "EXTERIEUR":
        if w_code in [51, 53, 55, 61, 63, 65, 71, 73, 75, 80, 81, 82, 95, 96, 99]:
            return 0.4 # Rain/Storm reduces outdoor event attendance
        elif w_code in [45, 48]:
            return 0.7 # Fog
        elif w_code in [0, 1, 2, 3]:
            return 1.2 # Nice weather boosts outdoor
            
    return 1.0

def calculer_facteurs_externes_sip(meteo_code, temp_max, is_weekend):
    """Helper to prepare external factors for Gemini prompt context."""
    desc = WMO_DESC.get(meteo_code, "")
    is_pluie = "Pluie" in desc or "Bruine" in desc or "Orage" in desc
    return {
        "meteo_resumee": desc,
        "is_pluie": is_pluie,
        "temp_max": temp_max
    }
