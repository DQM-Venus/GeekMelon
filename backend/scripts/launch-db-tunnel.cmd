@echo off
setlocal

set "BASE_DIR=D:\project\GeekMelon\backend"
set "SCRIPT_PATH=%BASE_DIR%\scripts\start-db-tunnel.ps1"

if "%GM_SSH_PASSWORD%"=="" (
    echo GM_SSH_PASSWORD is required.
    exit /b 1
)

start "geekmelon-db-tunnel" /b powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_PATH%"

endlocal
