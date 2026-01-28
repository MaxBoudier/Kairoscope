import json
import os
from datetime import datetime, timedelta
from google import genai
from google.genai import types
import settings
import sip_engine
import data_providers

class GeminiService:
    def __init__(self):
        self.client = self._get_client()

    def _get_client(self):
        try:
            api_key = settings.GEMINI_API_KEY
            if not api_key:
                return None
            return genai.Client(api_key=api_key)
        except Exception as e:
            print(f"Error configuring Gemini client: {e}")
            return None

    def get_future_data_with_sip(self, date_debut, date_fin, restaurant_config):
        """
        Executes the SIP pipeline: Weather -> Gemini Analysis -> SIP Calculation
        """
        if not self.client:
            print("Gemini Client not initialized (Missing Key?). Returning basic weather data.")
            
        # 1. Fetch Forecast
        weather_data = data_providers.get_weather_forecast(
            start_date=date_debut, 
            end_date=date_fin,
            lat=restaurant_config.get("latitude", 46.7833),
            lon=restaurant_config.get("longitude", 4.85)
        )
        
        # 2. Build Prompt Context
        days_list = []
        current_date_obj = datetime.strptime(date_debut, "%Y-%m-%d")
        end_date_obj = datetime.strptime(date_fin, "%Y-%m-%d")
        
        prompt_days_context = ""
        
        while current_date_obj <= end_date_obj:
            date_str = current_date_obj.strftime("%Y-%m-%d")
            days_fr = ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI", "DIMANCHE"]
            day_index = current_date_obj.weekday()
            day_name = days_fr[day_index]
            
            w_info = weather_data.get(date_str, {})
            w_code = w_info.get("code", 0)
            t_max = w_info.get("temp_max", 15)
            w_desc = w_info.get("desc", "Inconnu")
            
            ext_factors = sip_engine.calculer_facteurs_externes_sip(w_code, t_max, day_index >= 5)
            
            prompt_days_context += f"- Date: {date_str} ({day_name})\n"
            prompt_days_context += f"  Météo: {w_desc} (Code {w_code}), Max: {t_max}°C\n"
            prompt_days_context += f"  Facteurs pré-calculés: {json.dumps(ext_factors)}\n\n"
            
            days_list.append({
                "date": date_str,
                "day_name": day_name,
                "weather": w_info,
                "ext_factors": ext_factors
            })
            current_date_obj += timedelta(days=1)

        # 3. Call Gemini
        global_results = self._call_gemini_batch(prompt_days_context, days_list, restaurant_config)

        # 4. Post-Process with SIP Engine
        final_output = []
        
        for day_res in global_results:
            date_analysee = day_res.get("date")
            context_day = next((d for d in days_list if d["date"] == date_analysee), None)
            if not context_day: continue

            day_name = context_day["day_name"]
            w_code = context_day["weather"].get("code", 0)
            t_max = context_day["weather"].get("temp_max", 0)

            impact_total_soir = 0.0
            events_processed = []
            
            for event in day_res.get("events", []):
                nom = event.get("nom", "Inconnu")
                cat = event.get("categorie", "AUTRE")
                dist = event.get("distance_metres", 5000)
                lieu = event.get("type_lieu", "INTERIEUR")
                
                if "Valentin" in nom or "Mère" in nom: cat = "SPECIAL"

                base_ratio = sip_engine.get_impact_base(cat, 'soir_pre', restaurant_config.get("urban_context", "MOYEN"), restaurant_config.get("type_restaurant", "BRASSERIE"))
                impact_dist = sip_engine.calcul_impact_distance(base_ratio, dist, restaurant_config.get("urban_context", "MOYEN"))
                weather_mod = sip_engine.get_weather_event_modifier(w_code, lieu)
                impact_final = impact_dist * weather_mod
                
                impact_total_soir += impact_final
                
                event["impact_final_sip"] = impact_final
                events_processed.append(event)

            base_jour = sip_engine.IMPACT_BASE_JOUR.get(day_name, 0.1)
            sip = base_jour + impact_total_soir
            
            final_output.append({
                "date": date_analysee,
                "day_of_week": day_name, 
                "weather_code": w_code,
                "tmax": t_max,
                "sip": sip,
                "events": events_processed
            })
            
        return final_output

    def _call_gemini_batch(self, days_context, days_list_fallback, restaurant_config):
        if not self.client:
            return self._fallback_results(days_list_fallback)
        
        SYSTEM_INSTRUCTION = """
        Tu es un extracteur de données strict spécialisé en FoodTech et Yield Management.
        Ta mission est d'analyser l'impact potentiel sur la restauration pour **une liste de dates**.

        Consignes :
        1. Pour CHAQUE date fournie, utilise Google Search pour trouver les événements majeurs (sport, concert, business, fête populaire, grèves) à l'adresse indiquée.
        2. **JOURS SPÉCIAUX** : Tu DOIS identifier les jours spéciaux (Saint Valentin, Fête des Mères, Fête Nationale, etc.) et les traiter comme des événements de catégorie "SPECIAL". 
        3. Ne cherche PAS les vacances scolaires ni les jours fériés standards 'inertes' (comme le 8 mai sans event), sauf s'ils impliquent une sortie festive spéciale.
        4. Pour chaque événement, détermine s'il a lieu en INTÉRIEUR ou en EXTÉRIEUR.
        5. Si aucune information n'est trouvée pour une date spécifique, retourne une liste d'événements vide pour cette date.
        6. Retourne UNIQUEMENT une liste JSON d'objets.

        Consignes de Formatage (JSON Strict) :
        [
          {
            "date": "YYYY-MM-DD",
            "adresse": "...",
            "facteurs_externes_normalises": { ... }, 
            "events": [
              {
                 "nom": "string",
                 "categorie": "SPORT" | "CONCERT" | "BUSINESS" | "FAMILLE" | "CULTURE" | "FETE" | "SPECIAL" | "AUTRE",
                 "type_lieu": "INTERIEUR" | "EXTERIEUR",
                 "affluence_estimee_personnes": int,
                 "distance_metres": int,
                 "horaire_debut": "HH:MM"
              }
            ]
          },
          ...
        ]
        """

        USER_PROMPT = f"""
        Adresse : {restaurant_config.get("full_address", "Aucune adresse")}
        Contexte : {restaurant_config.get("urban_context", "MOYEN")}, {restaurant_config.get("type_restaurant", "BRASSERIE")}
        Dates :
        {days_context}
        """
        
        try:
            print("  -> Calling Gemini API...")
            response = self.client.models.generate_content(
                model='gemini-3-flash-preview',
                contents=SYSTEM_INSTRUCTION + "\n\n" + USER_PROMPT,
                config=types.GenerateContentConfig(
                    tools=[types.Tool(google_search=types.GoogleSearch())]
                )
            )
            print("  -> Gemini API returned.")
            
            raw_text = ""
            if response.text:
                raw_text = response.text.replace("```json", "").replace("```", "").strip()
            
            if raw_text.startswith("{"):
                raw_text = f"[{raw_text}]"
            
            print("Gemini's response :", raw_text)

            return json.loads(raw_text)

        except Exception as e:
            print(f"Gemini API Error: {e}")
            return self._fallback_results(days_list_fallback)

    def _fallback_results(self, days_list):
        print("Using fallback (Weather only).")
        results = []
        for d in days_list:
            results.append({
                "date": d["date"],
                "events": [] 
            })
        return results

# Singleton instance
service = GeminiService()

def get_future_data(date_debut, date_fin, restaurant_config):
    return service.get_future_data_with_sip(date_debut, date_fin, restaurant_config)
