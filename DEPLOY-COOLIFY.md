# Deploiement de Kairoscope via Coolify

Remplace la procedure decrite dans `DEPLOYMENT.md` et `SERVER_SETUP.md`
(docker-compose lance a la main sur le VPS, Nginx de l'hote en frontal).
Le deploiement se declenche desormais a chaque push sur `main`.

`docker-compose.yml` reste dedie au developpement local et n'est pas utilise
en production.

## Architecture

Quatre conteneurs sur un reseau Docker prive :

| Service | Image | Role |
|---|---|---|
| `front` | nginx + build Vite | Sert le frontend React et route en interne vers `api` et `ai` |
| `api` | PHP 8.4 / Apache | API Symfony 8 |
| `ai` | Python 3.10 + PyTorch | Prediction d'affluence, exposee en WebSocket |
| `database` | PostgreSQL 15 | Donnees applicatives |

Seul `front` porte un domaine. Son `nginx.conf` proxifie deja `/api` vers
l'API Symfony et `/api/predict` vers `ai:8000/ws/predict`, ce qui evite
d'exposer trois sous-domaines et supprime toute question de CORS.

Aucun port n'est publie sur l'hote : le proxy Traefik de Coolify atteint
`front` par le reseau Docker et termine le TLS.

## Ce qui change par rapport au compose de developpement

**PostgreSQL n'est plus expose.** L'ancien fichier publiait `5432:5432` sur
toutes les interfaces avec le couple `admin`/`admin`. A noter que `ports:`
court-circuite les regles iptables d'ufw : le pare-feu du serveur ne protegeait
pas de cette exposition.

**Les images embarquent leur code.** Le `Dockerfile` de dev ne copie rien et
compte sur un bind mount plus un `composer install` a chaque demarrage.
`webapp/api/Dockerfile.coolify` installe les dependances au build.

**Le schema initial est dans l'image de la base.** Un bind mount de
`webapp/init.sql` ne fonctionne pas sous Coolify, qui supprime le clone du
depot apres le build : Docker cree alors un repertoire a la place du fichier
absent et la base demarre vide. `webapp/Dockerfile.db` copie le dump.

**Symfony detecte HTTPS derriere le proxy** grace a
`config/packages/trusted_proxies.yaml`.

## Configuration dans Coolify

Type **Docker Compose**, fichier `docker-compose.coolify.yml`, source GitHub
App (necessaire pour que le webhook de deploiement automatique soit installe).

Variables d'environnement a renseigner :

| Variable | Role |
|---|---|
| `POSTGRES_PASSWORD` | mot de passe PostgreSQL |
| `APP_SECRET` | cle de signature Symfony |
| `REGISTRATION_SECRET` | secret d'inscription |
| `GEMINI_API_KEY` | cle API Google Gemini |

## Ressources allouees

`ai` : 2 Go / 1,5 vCPU (chargement du modele PyTorch) — `api` : 512 Mo / 1 vCPU
— `database` : 512 Mo / 0,5 vCPU — `front` : 128 Mo / 0,25 vCPU.

## Premier demarrage

`webapp/init.sql` cree les 7 tables mais aucune donnee. Tant qu'aucun
restaurant n'existe, le service IA repond `Restaurant 1 not found` et ferme la
connexion WebSocket — c'est attendu, pas une panne.

Pour rejouer le schema apres coup, il faut supprimer le volume `db_data` :
les scripts de `/docker-entrypoint-initdb.d` ne s'executent qu'une fois, sur
un repertoire de donnees vide.
