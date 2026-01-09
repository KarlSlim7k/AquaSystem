@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul
title AquaTenex - Quick Start

echo.
echo ╔════════════════════════════════════════════════╗
echo ║      AquaTenex - Quick Start Launcher         ║
echo ╚════════════════════════════════════════════════╝
echo.

REM Ejecutar Python y capturar el código de salida
python "%~dp0quick_start.py"
set EXIT_CODE=%errorlevel%

REM Si el código de salida no es 0, mostrar mensaje
if !EXIT_CODE! neq 0 (
    if !EXIT_CODE! neq 1 (
        echo.
        echo ❌ El programa finalizó con errores
        echo.
        pause
    )
)

endlocal
