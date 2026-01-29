# Kairoscope Deployment Guide

This guide explains how to use the new optimized environment setup for both Local Development and Production (VPS).

## 🚀 Local Development (PC)
*Goal: Hot-reloading, Debugging, fast feedback.*

**Setup:**
You have a `docker-compose.override.yml` file (gitignored) that automatically overrides the production settings.

**Command:**
```bash
docker-compose up -d --build
```

**That's it!**
- **Frontend**: http://localhost (Proxies to Vite Dev Server)
- **API**: http://localhost:8081 (Dev mode, Debug enabled)
- **Database**: `localhost:5432` (Exposed for external tools)
- **Code**: Changes in `webapp/front`, `webapp/api`, and `ai` are reflected instantly (Volumes are mounted).

---

## ☁️ Production (VPS)
*Goal: Performance, Security, Stability.*

**Setup:**
On your VPS, **DO NOT** create or copy `docker-compose.override.yml`. Only the main `docker-compose.yml` should exist.

**Command:**
```bash
docker-compose up -d --build
```

**What happens:**
- **Frontend**: Serves static assets via Nginx (Fast, optimized). No "Vite" server running.
- **API**: Runs in Production mode (No debug bar, optimized autoloader).
- **Database**:
    - Accessible at `YOUR_VPS_IP:5432` (As requested).
    - **Warning**: Ensure you have a strong password and consider using a firewall (UFW) to limit access to this port if possible.

## 🔒 VPS Nginx Configuration (HTTPS)

Since you are running Nginx on the host for HTTPS (Port 443), you need to configure it to proxy requests to your Docker container which is now running on port **8080**.

1.  **Edit your Nginx credentials site config** (usually `/etc/nginx/sites-available/default` or `/etc/nginx/sites-available/your-domain`).
2.  **Update the `location /` block** inside your `server { listen 443 ssl ... }` block:

```nginx
server {
    listen 443 ssl;
    server_name kairoscope.maxboudier.fr; # or your domain

    # Key/Cert paths managed by Certbot...
    # ssl_certificate ...
    # ssl_certificate_key ...

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3.  **Restart Nginx**:
    ```bash
    sudo systemctl restart nginx
    ```

**Important**: make sure you updated `docker-compose.yml` to map port `8080:80` (I have done this for you in the codebase).

## 🛠 Troubleshooting

**1. "I want to run Prod mode locally to test"**
Rename the override file temporarily:
```bash
mv docker-compose.override.yml docker-compose.override.yml.bak
docker-compose up -d --build
# Test...
mv docker-compose.override.yml.bak docker-compose.override.yml
```

**2. "The API container fails to start"**
Check logs: `docker-compose logs api`.
Ensure database is running: `docker-compose ps`.
