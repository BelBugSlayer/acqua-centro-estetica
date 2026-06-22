@echo off
setlocal
cd /d "%~dp0"

if not exist backend\.env (
  copy backend\.env.example backend\.env > nul
)

echo Instalando dependencias si faltan...
if not exist backend\node_modules (
  cd backend
  call npm install
  cd ..
)

if not exist frontend\node_modules (
  cd frontend
  call npm install
  cd ..
)

echo Cargando datos iniciales...
cd backend
call npm run seed
cd ..

echo Iniciando backend y frontend...
start "Acqua Backend" cmd /k "cd /d %CD%\backend && npm run dev"
start "Acqua Frontend" cmd /k "cd /d %CD%\frontend && npm run dev"

echo.
echo Listo. Abri la pagina en:
echo http://localhost:5173
echo.
pause
