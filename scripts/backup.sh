#!/usr/bin/env bash
set -euo pipefail

DB_NAME="${DB_NAME:-acqua_estetica}"
BACKUP_DIR="${BACKUP_DIR:-backups/$(date +%Y%m%d-%H%M%S)}"

mkdir -p "$BACKUP_DIR"
mongodump --db "$DB_NAME" --out "$BACKUP_DIR"

echo "Backup generado en $BACKUP_DIR"

