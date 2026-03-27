#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/geekmelon/app}"
ENV_FILE="${ENV_FILE:-/opt/geekmelon/env/.env}"
LOG_FILE="${LOG_FILE:-/opt/geekmelon/logs/crawler-cron.log}"

mkdir -p "$(dirname "$LOG_FILE")"

cd "$APP_DIR"
docker compose --env-file "$ENV_FILE" --profile tools run --rm crawler python main.py --source china_mix >>"$LOG_FILE" 2>&1
