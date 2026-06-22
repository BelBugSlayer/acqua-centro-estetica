@echo off
setlocal
cd /d "%~dp0"

echo Iniciando Acqua con Docker Desktop...
docker compose up -d

echo.
echo Listo. Abri la pagina en:
echo http://localhost:5173
echo.
pause
