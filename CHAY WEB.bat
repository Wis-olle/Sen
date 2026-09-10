@echo off
cd /d "%~dp0"
title Sen - web dang chay
echo.
echo   Server dang khoi dong tai http://localhost:5174
echo   Trinh duyet se tu mo sau vai giay.
echo   Dong cua so nay de tat server.
echo.
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep 6; Start-Process 'http://localhost:5174'"
npx --yes serve ui-v2 -l 5174
pause
