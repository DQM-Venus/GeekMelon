@echo off
setlocal

set "BASE_DIR=D:\project\GeekMelon\backend"
set "LOG_DIR=%BASE_DIR%\run"

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

set "GM_INGEST_TOKEN=geekmelon-dev-token"

cd /d "%BASE_DIR%"
start "geekmelon-backend" /b cmd /c "mvnw.cmd spring-boot:run > D:\project\GeekMelon\backend\run\backend.stdout.log 2> D:\project\GeekMelon\backend\run\backend.stderr.log"

endlocal
