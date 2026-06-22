#!/usr/bin/env bash
set -euo pipefail

cd backend
if [ ! -f .env ]; then
  cp .env.example .env
fi

npm run seed

