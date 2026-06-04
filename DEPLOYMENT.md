# EISR Portal Deployment Using Docker

## Project Overview

This project demonstrates how to deploy the EISR Portal application using Docker and Docker Compose.

The setup includes:

* Next.js Application
* MySQL 8 Database
* Docker Networking
* Persistent Database Storage
* Environment Variable Configuration
* Production Deployment Setup

---

# Architecture

```text
Browser
   |
   v
EISR Portal Container
   |
Docker Network
   |
MySQL 8 Container (Persistent Volume: eisr_mysql_data)
```

---

# Project Structure

```text
EISR/
├── Dockerfile
├── docker-compose.yml
├── deploy.sh          ← Safe redeploy script (use this always!)
├── restore.sh         ← Emergency data restore script
├── backups/           ← Auto-created backup files
├── .env
├── package.json
├── src/
├── public/
├── mysql/
│   └── init/
│       └── schema.sql ← Auto-runs on first MySQL container start
├── README.md
└── next.config.mjs
```

---

# Prerequisites

* Ubuntu Server / Linux System
* Docker Installed
* Docker Compose Installed
* Git Installed
* Internet Connection

---

# Server Ports

```text
3000 → Next.js Application
3306 → MySQL Database
```

---

# Step 1: Clone Repository

```bash
git clone https://github.com/eyeisr/EISR.git
cd EISR
```

---

# Step 2: Create Environment File

Copy sample environment file:

```bash
cp .env.example .env
nano .env
```

Example configuration:

```env
MYSQL_ROOT_PASSWORD=myStrongRootPassword
MYSQL_DATABASE=eisr_db
MYSQL_USER=eisr_user
MYSQL_PASSWORD=myStrongPassword

MYSQL_HOST=db
MYSQL_PORT=3306

JWT_SECRET=your_64_char_random_secret

NEXT_PUBLIC_APP_URL=http://your-server-ip:3000

NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

Generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

# Step 3: First Time Deploy

Build and start all containers (only do this ONCE on first deploy):

```bash
docker compose up -d --build
```

This will:
1. Build the Next.js app container
2. Start MySQL container
3. **Auto-run `mysql/init/schema.sql`** to create all tables

---

# Step 4: Verify Running Containers

```bash
docker ps
```

Expected containers:

```text
eisr_production_portal
eisr_mysql
```

---

# Step 5: Test Application

```bash
curl http://localhost:3000
curl http://localhost:3000/api/test-db
```

---

# ⚠️ CRITICAL: How to Redeploy Safely (Bug Fixes / Updates)

> **NEVER run `docker compose down -v` — this DELETES ALL DATA permanently!**

## ✅ Always use the safe deploy script:

```bash
bash deploy.sh
```

### What `deploy.sh` does:
1. 🔒 Takes automatic database backup to `./backups/`
2. 📥 Pulls latest code from git
3. 🏗️ Rebuilds **ONLY the app container** (DB is untouched)
4. ✅ Verifies the app is running

## ❌ NEVER do this:

```bash
docker compose down -v        # DELETES DATABASE VOLUME!
docker compose down           # Stops DB too (risky, use deploy.sh instead)
```

---

# Emergency: Restore Lost Data

If data was accidentally deleted, restore from backup:

```bash
# List available backups
ls -lh ./backups/

# Restore from a specific backup
bash restore.sh ./backups/eisr_db_backup_20260525_120000.sql
```

---

# Manual Database Backup

Take a manual backup at any time:

```bash
docker exec eisr_mysql mysqldump \
  -u root -p${MYSQL_ROOT_PASSWORD} \
  ${MYSQL_DATABASE} > ./backups/manual_backup_$(date +%Y%m%d_%H%M%S).sql
```

---

# Database Access

Open MySQL container:

```bash
docker exec -it eisr_mysql bash
mysql -u root -p
USE eisr_db;
SHOW TABLES;
```

---

# Step-by-Step Deployment Workflow

```text
First Time:
  git clone → cp .env.example .env → fill .env → docker compose up -d --build

Every Update After:
  Fix bug → git push → ssh into server → bash deploy.sh
```

---

# Technologies Used

* Next.js
* Node.js
* MySQL 8
* Docker
* Docker Compose
* Linux

---
