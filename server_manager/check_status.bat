@echo off
setlocal
chcp 65001 >nul

echo.
echo ╔════════════════════════════════════════════════╗
echo ║     AquaTenex - Estado de Servidores          ║
echo ╚════════════════════════════════════════════════╝
echo.

echo 🔍 Verificando servicios...
echo.

REM Verificar Apache
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🌐 APACHE (Backend)
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
netstat -ano | findstr ":80 " >nul
if %errorlevel% equ 0 (
    echo ✅ Puerto 80:  Activo ^(HTTP^)
) else (
    echo ❌ Puerto 80:  No disponible
)

netstat -ano | findstr ":443" >nul
if %errorlevel% equ 0 (
    echo ✅ Puerto 443: Activo ^(HTTPS^)
) else (
    echo ❌ Puerto 443: No disponible
)
echo.

REM Verificar Frontend
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ⚛️  FRONTEND (Vite)
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
netstat -ano | findstr ":5173" >nul
if %errorlevel% equ 0 (
    echo ✅ Puerto 5173: Activo
) else (
    echo ❌ Puerto 5173: No disponible
)
echo.

REM Verificar MySQL
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🗄️  MYSQL (Base de Datos)
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
netstat -ano | findstr ":3306" >nul
if %errorlevel% equ 0 (
    echo ✅ Puerto 3306: Activo
) else (
    echo ❌ Puerto 3306: No disponible
)
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 📡 ACCESO
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 🏠 LOCAL:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost/api
echo.
echo 🌍 REMOTO (VS Code Tunnels):
echo    Frontend: https://fs151wjc-5173.usw3.devtunnels.ms
echo    Backend:  https://fs151wjc-443.usw3.devtunnels.ms/api
echo.
echo 💡 Los tunnels se configuran en VS Code ^(pestaña PORTS^)
echo.

pause
endlocal
