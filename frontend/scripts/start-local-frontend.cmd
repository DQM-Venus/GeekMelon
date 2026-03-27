@echo off
setlocal

set "BASE_DIR=D:\project\GeekMelon\frontend"
set "LOG_DIR=%BASE_DIR%\run"

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

cd /d "%BASE_DIR%"
start "geekmelon-frontend" /b cmd /c "npm run dev -- --host 127.0.0.1 --port 5173 > D:\project\GeekMelon\frontend\run\frontend.stdout.log 2> D:\project\GeekMelon\frontend\run\frontend.stderr.log"

endlocal
