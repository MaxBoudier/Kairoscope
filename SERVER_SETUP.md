# Guide de Déploiement Kairoscope sur Serveur Distant

Pour faire tourner votre projet Kairoscope sur un serveur (avec une adresse IP différente de localhost), j'ai apporté des modifications pour rendre les URLs configurables. Voici la marche à suivre.

## 1. Modifications Effectuées

J'ai remplacé toutes les références codées en dur ("hardcoded") à `localhost` par des variables d'environnement dans le code React.

- **Frontend (`webapp/front`)**: Utilise maintenant `VITE_API_URL`, `VITE_API_BASE_URL` et `VITE_WS_URL`.
- **Backend (API)**: La configuration `SYMFONY_TRUSTED_HOSTS` dans `docker-compose.yml` a été élargie pour accepter toutes les requêtes entrant sur le conteneur.

## 2. Configuration sur le Serveur

Lorsque vous dploiez sur votre serveur, vous devez créer ou modifier le fichier `.env` dans le dossier `webapp/front`.

1.  Allez dans `webapp/front`.
2.  Créez ou éditez le fichier `.env`.
3.  Remplacez `localhost` par l'adresse IP publique de votre serveur (ou votre nom de domaine).

**Exemple de contenu pour `.env` (si votre IP est 192.168.1.50) :**

```env
VITE_API_URL=http://192.168.1.50:8081/api
VITE_WS_URL=ws://192.168.1.50:8000/ws
VITE_API_BASE_URL=http://192.168.1.50:8081
```

## 3. Lancement

Lancez simplement Docker Compose comme d'habitude. Il est recommandé de reconstruire les conteneurs pour s'assurer que les nouvelles variables d'environnement sont bien prises en compte par Vite au moment du build (ou du démarrage en mode dev).

```bash
docker-compose up --build -d
```

## 4. Points d'Attention

- **Vite Allowed Hosts**: Si vous rencontrez une erreur "Blocked by allowed hosts" ou similaire en accédant au frontend sur le port 80/5173, vous devrez peut-être ajouter votre IP dans `webapp/front/vite.config.js` dans la liste `allowedHosts`.
- **Ports**: Assurez-vous que les ports **80** (Frontend), **8081** (API), et **8000** (IA/WebSocket) sont ouverts dans le pare-feu de votre serveur.
