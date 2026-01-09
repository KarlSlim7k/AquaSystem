@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul
title AquaTenex - Server Manager

echo.
echo ╔════════════════════════════════════════════════╗
echo ║      AquaTenex - Server Manager Launcher      ║
echo ╚════════════════════════════════════════════════╝
echo.

REM Verificar si Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Python no está instalado o no está en el PATH
    echo.
    echo Por favor instala Python 3.6 o superior desde:
    echo https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

echo ✅ Python detectado
echo.

REM Ejecutar el script de Python
python "%~dp0server_manager.py"
set EXIT_CODE=%errorlevel%

REM Si hay error, mostrar mensaje (pero no si es salida normal con Ctrl+C)
if !EXIT_CODE! neq 0 (
    if !EXIT_CODE! neq 1 (
        echo.
        echo ❌ El programa finalizó con errores
        echo.
        pause
    )
)

endlocal
