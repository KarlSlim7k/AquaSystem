@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul
title AquaTenex - Verificación del Sistema

echo.
echo ╔════════════════════════════════════════════════╗
echo ║   AquaTenex - Verificación de Requisitos      ║
echo ╚════════════════════════════════════════════════╝
echo.

set "ERROR_COUNT=0"

REM Verificar Python
echo 🔍 Verificando Python...
python --version >nul 2>&1
if !errorlevel! equ 0 (
    for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
    echo ✅ !PYTHON_VERSION!
) else (
    echo ❌ Python NO instalado
    set /a ERROR_COUNT+=1
)
echo.

REM Verificar PHP
echo 🔍 Verificando PHP...
php --version >nul 2>&1
if !errorlevel! equ 0 (
    echo ✅ PHP instalado
) else (
    echo ❌ PHP NO instalado
    set /a ERROR_COUNT+=1
)
echo.

REM Verificar Node.js
echo 🔍 Verificando Node.js...
node --version >nul 2>&1
if !errorlevel! equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ Node.js !NODE_VERSION!
) else (
    echo ❌ Node.js NO instalado
    set /a ERROR_COUNT+=1
)
echo.

REM Verificar npm
echo 🔍 Verificando npm...
npm --version >nul 2>&1
if !errorlevel! equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo ✅ npm !NPM_VERSION!
) else (
    echo ❌ npm NO instalado
    set /a ERROR_COUNT+=1
)
echo.

REM Verificar Composer (opcional)
echo 🔍 Verificando Composer...
composer --version >nul 2>&1
if !errorlevel! equ 0 (
    echo ✅ Composer instalado
) else (
    echo ⚠️  Composer NO instalado (opcional)
)
echo.

REM Verificar directorios
echo 🔍 Verificando estructura del proyecto...
set "PROJECT_ROOT=%~dp0.."

if exist "%PROJECT_ROOT%\backend" (
    echo ✅ Directorio backend encontrado
) else (
    echo ❌ Directorio backend NO encontrado
    set /a ERROR_COUNT+=1
)

if exist "%PROJECT_ROOT%\frontend" (
    echo ✅ Directorio frontend encontrado
) else (
    echo ❌ Directorio frontend NO encontrado
    set /a ERROR_COUNT+=1
)
echo.

REM Verificar archivos clave
echo 🔍 Verificando archivos clave...
if exist "%PROJECT_ROOT%\backend\artisan" (
    echo ✅ Laravel artisan encontrado
) else (
    echo ❌ Laravel artisan NO encontrado
    set /a ERROR_COUNT+=1
)

if exist "%PROJECT_ROOT%\frontend\package.json" (
    echo ✅ Frontend package.json encontrado
) else (
    echo ❌ Frontend package.json NO encontrado
    set /a ERROR_COUNT+=1
)
echo.

REM Verificar psutil (para scripts con ventanas separadas)
echo 🔍 Verificando dependencias de Python...
python --version >nul 2>&1
if !errorlevel! equ 0 (
    python -c "import psutil" >nul 2>&1
    if !errorlevel! equ 0 (
        echo ✅ psutil instalado
    ) else (
        echo ⚠️  psutil NO instalado (necesario para start_windows.bat)
        echo    Se instalará automáticamente al ejecutar start_windows.bat
    )
)
echo.

REM Resumen
echo ════════════════════════════════════════════════
echo.
if !ERROR_COUNT! equ 0 (
    echo ✅ ¡Todo está configurado correctamente!
    echo.
    echo 🚀 Puedes usar cualquiera de estos comandos:
    echo    • start_separate.bat      (Recomendado - ventanas separadas)
    echo    • start_windows.bat       (Menú con ventanas separadas)
    echo    • start_v2.bat            (Una ventana con logs combinados)
    echo    • stop_servers.bat        (Detener todos los servidores)
) else (
    echo ❌ Se encontraron !ERROR_COUNT! problema(s)
    echo.
    echo 📝 Instalación requerida:
    python --version >nul 2>&1
    if !errorlevel! neq 0 (
        echo    • Python: https://www.python.org/downloads/
    )
    php --version >nul 2>&1
    if !errorlevel! neq 0 (
        echo    • PHP: https://www.php.net/downloads
    )
    node --version >nul 2>&1
    if !errorlevel! neq 0 (
        echo    • Node.js: https://nodejs.org/
    )
)
echo.

pause
endlocal
