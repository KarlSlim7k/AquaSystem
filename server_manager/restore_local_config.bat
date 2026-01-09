@echo off
chcp 65001 >nul
title AquaTenex - Restaurar Modo Local

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║          AquaTenex - Restaurar Configuración Local            ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo 📋 Restaurando configuración local...
echo.

REM Verificar si existe .env actual
if exist "%~dp0..\backend\.env" (
    echo [1/3] Respaldando .env actual...
    copy /Y "%~dp0..\backend\.env" "%~dp0..\backend\.env.backup" >nul
    echo       ✅ Respaldo creado: backend\.env.backup
)

REM Restaurar configuración local del backend
echo [2/3] Backend: Restaurando configuración local...
if exist "%~dp0..\backend\.env.example" (
    copy /Y "%~dp0..\backend\.env.example" "%~dp0..\backend\.env" >nul
    echo       ✅ Backend restaurado a modo local
) else (
    echo       ⚠️  No se encontró .env.example, manteniendo .env actual
)

REM Eliminar .env del frontend para usar valores por defecto
echo [3/3] Frontend: Limpiando configuración...
if exist "%~dp0..\frontend\.env" (
    del "%~dp0..\frontend\.env" 2>nul
    echo       ✅ Frontend configurado para localhost
) else (
    echo       ℹ️  Frontend ya está en modo por defecto
)

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║               ✅ Configuración Local Restaurada                 ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 📝 URLs actuales:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:8000
echo.
echo 🚀 Puedes iniciar los servidores con:
echo    start_separate.bat o start_v2.bat
echo.
pause
