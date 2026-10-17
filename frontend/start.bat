@echo off
echo ========================================================
echo  Starting AI Manufacturing Planning & Scheduling System
echo ========================================================
echo.
cd /d "%~dp0"
python start_server.py
if %ERRORLEVEL% NEQ 0 (
    echo Python failed or not found in PATH. Trying py launcher...
    py start_server.py
)
pause
