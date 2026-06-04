#!/bin/bash
# ═══════════════════════════════════════════════════════
#  EISR Portal — Database Restore Script
#  Usage: bash restore.sh ./backups/eisr_db_backup_XXXX.sql
# ═══════════════════════════════════════════════════════

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo ""
  echo "❌ Usage: bash restore.sh <backup_file.sql>"
  echo ""
  echo "📦 Available backups:"
  ls -lh ./backups/*.sql 2>/dev/null || echo "   No backups found in ./backups/"
  echo ""
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Backup file not found: $BACKUP_FILE"
  exit 1
fi

echo ""
echo "⚠️  WARNING: This will OVERWRITE current database with backup!"
echo "   Backup file: $BACKUP_FILE"
echo ""
read -p "Are you sure? Type 'yes' to continue: " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "❌ Restore cancelled."
  exit 0
fi

echo ""
echo "♻️  Restoring database from backup..."
docker exec -i eisr_mysql mysql \
  -u root \
  -p"${MYSQL_ROOT_PASSWORD}" \
  "${MYSQL_DATABASE}" < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "✅ Database restored successfully from: $BACKUP_FILE"
else
  echo "❌ Restore failed. Please check the backup file."
fi
echo ""
