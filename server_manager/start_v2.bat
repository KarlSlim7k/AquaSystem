@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul
title AquaTenex - Server Manager v2

echo.
echo ╔════════════════════════════════════════════════╗
echo ║   AquaTenex - Server Manager v2 (Mejorado)    ║
echo ╚════════════════════════════════════════════════╝
echo.

REM Verificar Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Python no está instalado
    pause
    exit /b 1
)

echo ✅ Python detectado
echo.

REM Ejecutar versión mejorada
python "%~dp0server_manager_v2.py"

endlocal
