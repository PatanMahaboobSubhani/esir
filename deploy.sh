#!/bin/bash
# ═══════════════════════════════════════════════════════
#  EISR Portal — Safe Deployment Script
#  Usage: bash deploy.sh
#  This script safely redeploys ONLY the app container
#  WITHOUT touching the database or its data.
# ═══════════════════════════════════════════════════════

set -e  # Exit on any error

# ── Load environment variables ──
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/eisr_db_backup_$TIMESTAMP.sql"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║      EISR Portal — Safe Deploy Script        ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# ── Step 1: Create backup directory ──
mkdir -p "$BACKUP_DIR"

# ── Step 2: Backup database BEFORE deploy ──
echo "🔒 [1/4] Taking database backup..."
docker exec eisr_mysql mysqldump \
  -u root \
  -p"${MYSQL_ROOT_PASSWORD}" \
  "${MYSQL_DATABASE}" > "$BACKUP_FILE" 2>/dev/null

if [ $? -eq 0 ]; then
  echo "✅ Backup saved: $BACKUP_FILE"
else
  echo "⚠️  WARNING: Backup failed — but continuing. Check manually."
fi

echo ""
echo "🔨 [2/4] Pulling latest code from git..."
git pull origin main

echo ""
echo "🏗️  [3/4] Rebuilding ONLY the app container (DB untouched)..."
docker compose up -d --build --no-deps eisr_portal

echo ""
echo "⏳ [4/4] Waiting for app to be healthy..."
sleep 5

# ── Check if app is running ──
if docker ps | grep -q "eisr_production_portal"; then
  echo ""
  echo "╔══════════════════════════════════════════════╗"
  echo "║  ✅ Deploy SUCCESS! App is running on :3000  ║"
  echo "╚══════════════════════════════════════════════╝"
  echo ""
  echo "📦 Database backup is at: $BACKUP_FILE"
  echo "🌐 App URL: http://localhost:3000"
else
  echo ""
  echo "❌ Deploy FAILED. App container not running."
  echo "👉 To restore database from backup:"
  echo "   docker exec -i eisr_mysql mysql -u root -p\${MYSQL_ROOT_PASSWORD} \${MYSQL_DATABASE} < $BACKUP_FILE"
fi

echo ""
