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
