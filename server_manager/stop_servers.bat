@echo off
chcp 65001 >nul
title AquaTenex - Detener Servidores

echo.
echo ╔════════════════════════════════════════════════╗
echo ║   AquaTenex - Detener Todos los Servidores    ║
echo ╚════════════════════════════════════════════════╝
echo.

echo 🔍 Verificando servidores en ejecución...
echo.

REM Verificar Frontend (Node.js)
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo 🟢 Frontend detectado ^(Node.js^)
    set NODE_RUNNING=1
) else (
    echo ⚪ Frontend no está corriendo
    set NODE_RUNNING=0
)

REM Verificar Backend PHP (artisan serve)
tasklist /FI "IMAGENAME eq php.exe" 2>NUL | find /I /N "php.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo 🟢 PHP detectado ^(artisan serve^)
    set PHP_RUNNING=1
) else (
    echo ⚪ PHP no está corriendo
    set PHP_RUNNING=0
)

REM Verificar Backend Apache
tasklist /FI "IMAGENAME eq httpd.exe" 2>NUL | find /I /N "httpd.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo � Apache detectado ^(Backend^)
    set APACHE_RUNNING=1
) else (
    echo ⚪ Apache no está corriendo
    set APACHE_RUNNING=0
)

echo.

REM Si no hay nada corriendo
if "%NODE_RUNNING%"=="0" if "%PHP_RUNNING%"=="0" if "%APACHE_RUNNING%"=="0" (
    echo ℹ️  No hay servidores en ejecución
    echo.
    pause
    exit /b 0
)

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo ⚠️  Se detendrán los siguientes servidores:
if "%NODE_RUNNING%"=="1" echo    • Frontend ^(Vite - Node.js^)
if "%PHP_RUNNING%"=="1" echo    • Backend PHP ^(artisan serve^)
if "%APACHE_RUNNING%"=="1" echo    • Backend Apache ^(puerto 80/443^)
echo.
echo ¿Deseas continuar? (S/N)
set /p CONFIRM="Respuesta: "

if /I "%CONFIRM%" NEQ "S" (
    echo.
    echo ℹ️  Operación cancelada
    echo.
    pause
    exit /b 0
)

echo.
echo 🛑 Deteniendo servidores...
echo.

REM Detener Node.js (Frontend)
if "%NODE_RUNNING%"=="1" (
    echo � Deteniendo Frontend ^(Node.js^)...
    taskkill /F /IM node.exe /T >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Frontend detenido correctamente
    ) else (
        echo ⚠️  Error al detener Frontend
    )
)

REM Detener PHP (Backend artisan serve)
if "%PHP_RUNNING%"=="1" (
    echo � Deteniendo PHP ^(artisan serve^)...
    taskkill /F /IM php.exe /T >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ PHP detenido correctamente
    ) else (
        echo ⚠️  Error al detener PHP
    )
)

REM Detener Apache (Backend principal)
if "%APACHE_RUNNING%"=="1" (
    echo 🔴 Deteniendo Apache...
    taskkill /F /IM httpd.exe /T >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Apache detenido correctamente
    ) else (
        echo ⚠️  Error al detener Apache
    )
)

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo ✅ Proceso completado
echo.
echo 💡 Para reiniciar los servidores ejecuta:
echo    • Desarrollo local:    server_manager\start_separate.bat
echo    • Acceso remoto:       server_manager\start_remote_access.bat
echo.

pause
