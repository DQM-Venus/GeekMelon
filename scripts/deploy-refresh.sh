#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/geekmelon/app}"
ENV_FILE="${ENV_FILE:-/opt/geekmelon/env/.env}"

cd "$APP_DIR"
git pull
docker compose --env-file "$ENV_FILE" build
docker compose --env-file "$ENV_FILE" up -d
