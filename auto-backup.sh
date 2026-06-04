#!/bin/bash

cd /home/pi/EISR || exit 1
source /home/pi/EISR/.env.backup

DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_DIR="/home/pi/EISR/backups"
STATE_DIR="/home/pi/EISR/.backup-state"

DB_BACKUP="$BACKUP_DIR/eisr_db_$DATE.sql"
UPLOADS_BACKUP="$BACKUP_DIR/eisr_uploads_$DATE.tar.gz"

SCHEMA_FILE="/home/pi/EISR/mysql/init/schema.sql"
TEMP_DB="/tmp/eisr_db_current.sql"
TEMP_UPLOADS_HASH="/tmp/eisr_uploads_current.hash"

LAST_DB_HASH="$STATE_DIR/db.hash"
LAST_UPLOADS_HASH="$STATE_DIR/uploads.hash"

mkdir -p "$BACKUP_DIR"
mkdir -p "$STATE_DIR"
mkdir -p "/home/pi/EISR/mysql/init"

echo "====================================="
echo "Starting smart backup: $DATE"

# Current DB dump
docker exec db mariadb-dump --skip-comments --single-transaction -u root -p"$DB_PASSWORD" eisr_db > "$TEMP_DB"

CURRENT_DB_HASH=$(md5sum "$TEMP_DB" | awk '{print $1}')
OLD_DB_HASH=""
[ -f "$LAST_DB_HASH" ] && OLD_DB_HASH=$(cat "$LAST_DB_HASH")

# Current uploads hash
if [ -d "/home/pi/EISR/public/uploads" ]; then
  find public/uploads -type f -exec md5sum {} \; | sort | md5sum | awk '{print $1}' > "$TEMP_UPLOADS_HASH"
else
  echo "no_uploads" > "$TEMP_UPLOADS_HASH"
fi

CURRENT_UPLOADS_HASH=$(cat "$TEMP_UPLOADS_HASH")
OLD_UPLOADS_HASH=""
[ -f "$LAST_UPLOADS_HASH" ] && OLD_UPLOADS_HASH=$(cat "$LAST_UPLOADS_HASH")

DB_CHANGED=false
UPLOADS_CHANGED=false

if [ "$CURRENT_DB_HASH" != "$OLD_DB_HASH" ]; then
  DB_CHANGED=true
fi

if [ "$CURRENT_UPLOADS_HASH" != "$OLD_UPLOADS_HASH" ]; then
  UPLOADS_CHANGED=true
fi

if [ "$DB_CHANGED" = false ] && [ "$UPLOADS_CHANGED" = false ]; then
  echo "No database/uploads changes detected. Backup skipped."
  echo "Backup completed: $DATE"
  exit 0
fi

# DB backup only if changed
if [ "$DB_CHANGED" = true ]; then
  cp "$TEMP_DB" "$DB_BACKUP"
  cp "$TEMP_DB" "$SCHEMA_FILE"
  echo "$CURRENT_DB_HASH" > "$LAST_DB_HASH"
  echo "Database changed. DB backup created."
fi

# Uploads backup only if changed
if [ "$UPLOADS_CHANGED" = true ]; then
  tar -czf "$UPLOADS_BACKUP" public/uploads
  echo "$CURRENT_UPLOADS_HASH" > "$LAST_UPLOADS_HASH"
  echo "Uploads changed. Uploads backup created."
fi

# GitHub backup
git config user.name "EISR Backup Bot"
git config user.email "official.eyeisr@gmail.com"

git add mysql/init/schema.sql auto-backup.sh
git add -f public/uploads

if git diff --cached --quiet; then
  echo "No GitHub changes. Commit/push skipped."
else
  git commit -m "Auto backup updated database/uploads $DATE"
  git push origin main || echo "Git push failed. Check internet or GitHub SSH/DNS."
fi

# Google Drive upload only changed files
echo "Uploading changed backups to Google Drive..."

if [ "$DB_CHANGED" = true ]; then
  rclone copy "$DB_BACKUP" gdrive:EISR-Backups/database && echo "DB uploaded to Google Drive"
  rclone copy "$SCHEMA_FILE" gdrive:EISR-Backups/schema && echo "Schema uploaded to Google Drive"
fi

if [ "$UPLOADS_CHANGED" = true ]; then
  rclone copy "$UPLOADS_BACKUP" gdrive:EISR-Backups/uploads && echo "Uploads tar uploaded to Google Drive"
  rclone copy /home/pi/EISR/public/uploads gdrive:EISR-Backups/public-uploads && echo "Public uploads uploaded to Google Drive"
fi

echo "Backup completed: $DATE"
