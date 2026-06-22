#!/usr/bin/env bash
set -euo pipefail

echo "Instalando dependencias del backend..."
cd backend
npm install

echo "Instalando dependencias del frontend..."
cd ../frontend
npm install

echo "Listo. Copia backend/.env.example a backend/.env antes de ejecutar."

