@echo off
title OptiManufact AI - Share Online
cd /d "%~dp0"
echo ========================================================
echo  OptiManufact AI - Instant Public Sharing
echo ========================================================
echo.
echo Starting local web server in the background...
start /b python -m http.server 8080 >nul 2>&1
timeout /t 2 >nul

echo.
echo Connecting to secure tunnel to generate a public link...
echo (Anyone with this link will be able to view your website on phone/PC)
echo.
echo Press Ctrl+C at any time to stop sharing.
echo ========================================================
echo.
ssh -p 443 -o StrictHostKeyChecking=no -R0:localhost:8080 a.pinggy.io
pause
