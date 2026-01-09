@echo off
REM ============================================================
REM AQUATENEX - INSTALADOR DE DEPENDENCIAS
REM Script para instalar las dependencias necesarias
REM ============================================================

echo.
echo ============================================================
echo AQUATENEX - INSTALADOR DE DEPENDENCIAS
echo ============================================================
echo.

REM Verificar que Python está instalado
echo [1/3] Verificando instalacion de Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo [X] ERROR: Python no esta instalado
    echo.
    echo Por favor instala Python 3.7 o superior desde:
    echo https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

python --version
echo [OK] Python encontrado
echo.

REM Verificar pip
echo [2/3] Verificando pip...
python -m pip --version >nul 2>&1
if errorlevel 1 (
    echo [X] ERROR: pip no esta instalado
    echo.
    pause
    exit /b 1
)
echo [OK] pip encontrado
echo.

REM Instalar dependencias
echo [3/3] Instalando dependencias...
echo.
echo Instalando bcrypt...
python -m pip install bcrypt
echo.
echo Instalando mysql-connector-python...
python -m pip install mysql-connector-python
echo.

echo ============================================================
echo INSTALACION COMPLETADA
echo ============================================================
echo.
echo Ahora puedes ejecutar el gestor de contraseñas:
echo   python password_manager.py
echo.
echo Para mas informacion, consulta: README_PASSWORD_MANAGER.md
echo.
pause
