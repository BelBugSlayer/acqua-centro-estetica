#!/usr/bin/env bash
set -euo pipefail

DB_NAME="${DB_NAME:-acqua_estetica}"
BACKUP_PATH="${1:-}"

if [ -z "$BACKUP_PATH" ]; then
  echo "Uso: bash scripts/restore.sh backups/20260615-120000/acqua_estetica"
  exit 1
fi

mongorestore --drop --db "$DB_NAME" "$BACKUP_PATH"

echo "Base $DB_NAME restaurada desde $BACKUP_PATH"
