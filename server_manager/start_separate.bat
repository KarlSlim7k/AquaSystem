@echo off
setlocal
chcp 65001 >nul

echo.
echo ╔════════════════════════════════════════════════╗
echo ║   AquaTenex - Inicio Rápido (2 Ventanas)      ║
echo ╚════════════════════════════════════════════════╝
echo.

REM Obtener rutas
set "PROJECT_ROOT=%~dp0.."
set "BACKEND_DIR=%PROJECT_ROOT%\backend"
set "FRONTEND_DIR=%PROJECT_ROOT%\frontend"

REM Verificar que existan los directorios
if not exist "%BACKEND_DIR%" (
    echo ❌ Error: No se encontró el directorio backend
    pause
    exit /b 1
)

if not exist "%FRONTEND_DIR%" (
    echo ❌ Error: No se encontró el directorio frontend
    pause
    exit /b 1
)

echo ✅ Directorios verificados
echo.

REM Iniciar Backend en nueva ventana
echo 🚀 Iniciando Backend en nueva ventana...
start "AquaTenex - Backend (Laravel)" powershell -NoExit -Command ^
"$Host.UI.RawUI.WindowTitle = 'AquaTenex - Backend (Laravel)'; ^
Write-Host ''; ^
Write-Host '╔════════════════════════════════════════════════╗' -ForegroundColor Cyan; ^
Write-Host '║      AquaTenex - Backend Server (Laravel)     ║' -ForegroundColor Cyan; ^
Write-Host '╚════════════════════════════════════════════════╝' -ForegroundColor Cyan; ^
Write-Host ''; ^
Write-Host '🌐 URL: http://localhost:8000' -ForegroundColor Green; ^
Write-Host '⚠️  Presiona Ctrl+C para detener' -ForegroundColor Yellow; ^
Write-Host ''; ^
Write-Host '═══════════════════════════════════════════════' -ForegroundColor Gray; ^
Write-Host ''; ^
Set-Location '%BACKEND_DIR%'; ^
php artisan serve"

timeout /t 2 /nobreak >nul

REM Iniciar Frontend en nueva ventana
echo 🚀 Iniciando Frontend en nueva ventana...
start "AquaTenex - Frontend (Vite)" powershell -NoExit -Command ^
"$Host.UI.RawUI.WindowTitle = 'AquaTenex - Frontend (Vite)'; ^
Write-Host ''; ^
Write-Host '╔════════════════════════════════════════════════╗' -ForegroundColor Magenta; ^
Write-Host '║      AquaTenex - Frontend Server (Vite)       ║' -ForegroundColor Magenta; ^
Write-Host '╚════════════════════════════════════════════════╝' -ForegroundColor Magenta; ^
Write-Host ''; ^
Write-Host '🌐 URL: http://localhost:5173' -ForegroundColor Green; ^
Write-Host '⚠️  Presiona Ctrl+C para detener' -ForegroundColor Yellow; ^
Write-Host ''; ^
Write-Host '═══════════════════════════════════════════════' -ForegroundColor Gray; ^
Write-Host ''; ^
Set-Location '%FRONTEND_DIR%'; ^
npm run dev"

echo.
echo ✅ Servidores iniciados en ventanas separadas
echo.
echo 📍 Backend:  http://localhost:8000
echo 📍 Frontend: http://localhost:5173
echo.
echo 💡 Para detener los servidores, cierra las ventanas o presiona Ctrl+C en cada una
echo.

endlocal
