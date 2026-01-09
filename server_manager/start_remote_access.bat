@echo off
setlocal
chcp 65001 >nul

echo.
echo ╔════════════════════════════════════════════════╗
echo ║   AquaTenex - Inicio con Acceso Remoto        ║
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

REM Verificar que Apache esté corriendo
echo 🔍 Verificando Apache (necesario para acceso remoto)...
netstat -ano | findstr ":443" >nul
if %errorlevel% equ 0 (
    echo ✅ Apache está corriendo en puerto 443
) else (
    echo ⚠️  Apache no está corriendo. Intentando iniciar...
    start "" "C:\xampp\apache\bin\httpd.exe"
    timeout /t 3 /nobreak >nul
    echo ✅ Apache iniciado
)
echo.

REM Iniciar Backend (NO necesario si Apache está sirviendo Laravel)
echo 📝 Nota: El backend se sirve a través de Apache en puerto 443
echo    No es necesario iniciar php artisan serve
echo.

REM Iniciar Frontend en nueva ventana
echo 🚀 Iniciando Frontend en nueva ventana...
start "AquaTenex - Frontend (Vite)" powershell -NoExit -Command ^
"$Host.UI.RawUI.WindowTitle = 'AquaTenex - Frontend (Vite + Tunnels)'; ^
Write-Host ''; ^
Write-Host '╔════════════════════════════════════════════════╗' -ForegroundColor Magenta; ^
Write-Host '║   AquaTenex - Frontend (Acceso Remoto)        ║' -ForegroundColor Magenta; ^
Write-Host '╚════════════════════════════════════════════════╝' -ForegroundColor Magenta; ^
Write-Host ''; ^
Write-Host '🌐 Local:  http://localhost:5173' -ForegroundColor Green; ^
Write-Host '🌍 Remoto: Configura VS Code Tunnels en puerto 5173' -ForegroundColor Cyan; ^
Write-Host ''; ^
Write-Host '📡 Backend configurado en: https://fs151wjc-443.usw3.devtunnels.ms' -ForegroundColor Yellow; ^
Write-Host ''; ^
Write-Host '⚠️  Presiona Ctrl+C para detener' -ForegroundColor Yellow; ^
Write-Host ''; ^
Write-Host '═══════════════════════════════════════════════' -ForegroundColor Gray; ^
Write-Host ''; ^
Set-Location '%FRONTEND_DIR%'; ^
npm run dev"

echo.
echo ✅ Servidor Frontend iniciado
echo.
echo ╔════════════════════════════════════════════════╗
echo ║              INSTRUCCIONES DE USO              ║
echo ╚════════════════════════════════════════════════╝
echo.
echo 📍 ACCESO LOCAL:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost/api  (a través de Apache)
echo.
echo 🌍 ACCESO REMOTO (VS Code Tunnels):
echo    1. Asegúrate de que los puertos estén en "Public" en VS Code
echo    2. Frontend Tunnel: puerto 5173
echo    3. Backend Tunnel:  puerto 443
echo.
echo 📡 URLs de Tunnel actuales:
echo    Frontend: https://fs151wjc-5173.usw3.devtunnels.ms
echo    Backend:  https://fs151wjc-443.usw3.devtunnels.ms
echo.
echo 💡 TIPS:
echo    - Apache debe estar corriendo para servir el backend
echo    - Los tunnels se configuran automáticamente en VS Code
echo    - El frontend ya está configurado para usar el tunnel del backend
echo.
echo 🛑 Para detener: Cierra la ventana del frontend o presiona Ctrl+C
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo ¿Deseas detener todos los servidores ahora? (S/N)
set /p STOP_SERVERS="Respuesta: "

if /i "%STOP_SERVERS%"=="S" (
    echo.
    echo 🛑 Deteniendo todos los servidores...
    echo.
    
    REM Detener Node.js (Frontend)
    echo 🔴 Deteniendo Frontend...
    taskkill /F /IM node.exe >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Frontend detenido
    ) else (
        echo ℹ️  Frontend no estaba corriendo
    )
    
    REM Detener Apache
    echo 🔴 Deteniendo Apache...
    taskkill /F /IM httpd.exe >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Apache detenido
    ) else (
        echo ℹ️  Apache no estaba corriendo
    )
    
    echo.
    echo ✅ Todos los servidores han sido detenidos
    echo.
    pause
) else (
    echo.
    echo ℹ️  Los servidores siguen ejecutándose
    echo.
)

endlocal
