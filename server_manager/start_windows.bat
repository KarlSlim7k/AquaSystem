@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul
title AquaTenex - Server Manager (Ventanas Separadas)

echo.
echo ╔════════════════════════════════════════════════╗
echo ║   Server Manager - Ventanas Separadas         ║
echo ╚════════════════════════════════════════════════╝
echo.

REM Verificar Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Python no está instalado
    echo.
    pause
    exit /b 1
)

echo ✅ Python detectado
echo.

REM Verificar si psutil está instalado
python -c "import psutil" >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Instalando dependencia psutil...
    echo.
    python -m pip install psutil
    if %errorlevel% neq 0 (
        echo ❌ Error al instalar psutil
        pause
        exit /b 1
    )
    echo.
    echo ✅ psutil instalado correctamente
    echo.
)

REM Ejecutar el script
python "%~dp0server_manager_windows.py"

endlocal
