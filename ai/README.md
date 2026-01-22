# Documentation Serveur Websocket Kairoscope

Ce document explique comment démarrer le serveur de prédiction et comment interagir avec lui via Websocket.

## 1. Installation des dépendances

Assurez-vous d'avoir les librairies nécessaires installées :

```bash
pip install fastapi uvicorn
```

## 2. Démarrage du Serveur

Lancez le serveur avec Python :

```bash
# Depuis le dossier Kairoscope/datasets
python server.py
```

Vous devriez voir :

```text
INFO:     Started server process [PID]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

## 3. Connexion Websocket

* **URL** : `ws://localhost:8000/ws/predict`
* **Méthode** : Websocket

Dès la connexion, le serveur lance automatiquement le pipeline de prédiction et commence à envoyer des messages.

## 4. Format des Messages

Le serveur envoie des objets JSON successifs. Voici les différents types de messages que vous recevrez :

### A. Message de Statut (Information simple)

```json
{
  "status": "message",
  "message": "Chargement des données..."
}
```

### B. Progression de l'Entraînement (Barre de chargement)

Ce message est envoyé à chaque "époque" d'entraînement.
*Note : `total_step` peut s'ajuster dynamiquement (diminuer) si le modèle converge plus vite que prévu.*

```json
{
  "status": "steps",
  "message": "Prédiction Kairoscope du futur en cours...",
  "step_name": "Etape 5 sur 25",
  "step": 5,           // Étape actuelle
  "total_step": 25     // Objectif total (estimé)
}
```

### C. Résultat Final

Envoyé une fois le calcul terminé. Contient la liste des objets JSON finaux.

```json
{
  "status": "output",
  "payload": [
    {
      "date": "2026-02-01",
      "predicted_affluence": 45,
      "conf_low": 40,
      "conf_high": 50,
      "confidence_score": "High",
      ...
    },
    ...
  ]
}
```

### D. Erreur

En cas de problème technique.

```json
{
  "status": "error",
  "message": "Description de l'erreur..."
}
```

## 5. Exemple de Client (Javascript / Frontend)

Voici un exemple simple pour tester la connexion depuis une page web ou la console du navigateur :

```javascript
const socket = new WebSocket("ws://localhost:8000/ws/predict");

socket.onopen = function(e) {
  console.log("Connexion établie");
};

socket.onmessage = function(event) {
  const data = JSON.parse(event.data);
  
  if (data.status === "message") {
    console.log("Info:", data.message);
  } else if (data.status === "steps") {
    console.log(`Progression: ${data.step}/${data.total_step} - ${data.step_name}`);
    // Mettre à jour votre barre de progression ici
  } else if (data.status === "output") {
    console.log("Résultat Reçu:", data.payload);
    // Afficher les graphiques
  } else if (data.status === "error") {
    console.error("Erreur:", data.message);
  }
};

socket.onclose = function(event) {
  if (event.wasClean) {
    console.log(`Connexion fermée proprement`);
  } else {
    console.log('Connexion interrompue');
  }
};
```
