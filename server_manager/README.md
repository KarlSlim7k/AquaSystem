# Server Manager - Gestor de Servidores AquaTenex

## 📋 Descripción

Conjunto de scripts que permiten iniciar, detener y administrar los servidores de desarrollo (Backend Laravel y Frontend Vite) desde una única interfaz o en ventanas separadas.

## ✨ Características

- 🚀 Iniciar ambos servidores con un solo comando
- 🪟 **NUEVO: Abrir servidores en ventanas de PowerShell separadas**
- ⏹️ Detener servidores de forma segura
- 📊 Verificar estado de los servidores en tiempo real
- 🔄 Reiniciar servidores fácilmente
- 🎨 Interfaz con colores para mejor visualización
- 💻 Logs en tiempo real de ambos servidores
- 🔒 Limpieza automática al salir (Ctrl+C o cierre normal)
- 🛑 Script dedicado para detener todos los servidores

## 🔧 Requisitos

- Python 3.6 o superior
- PHP y Composer (para Laravel)
- Node.js y npm (para Vite)

## 📦 Versiones Disponibles

### 🪟 `server_manager_windows.py` + `start_windows.bat` (NUEVO - Ventanas Separadas) ⭐⭐⭐
- ✅ **Abre cada servidor en su propia ventana de PowerShell**
- ✅ Logs separados para mejor visualización
- ✅ Menú de control centralizado
- ✅ Verifica estado de servidores por PID
- ✅ Requiere `psutil` (se instala automáticamente)

### 🚀 `start_separate.bat` (Inicio Rápido - Ventanas Separadas) ⭐⭐
- ✅ **Inicia ambos servidores en ventanas separadas inmediatamente**
- ✅ No requiere Python, solo PowerShell
- ✅ La forma más simple y directa
- ✅ Perfecto para uso diario

### 🛑 `stop_servers.bat` (Detener Todos)
- ✅ Detiene todos los servidores Node.js y PHP
- ✅ Confirmación antes de detener
- ✅ Verifica qué procesos están activos

### 🌟 `server_manager_v2.py` + `start_v2.bat`
- ✅ Mejor manejo de Ctrl+C en Windows
- ✅ Usa `taskkill` para terminar procesos correctamente
- ✅ Limpieza automática del árbol de procesos
- ✅ Una sola ventana con logs combinados

### `server_manager.py` + `start_servers.bat`
- 📋 Menú interactivo completo
- 🔧 Control individual de servidores
- 📊 Estado y reinicio de servidores
- ⚙️ Más opciones de configuración

### `quick_start.py` + `quick_start.bat`
- 🚀 Inicio rápido sin menú
- 📝 Logs directos en terminal
- 🔄 Actualizado con mejor manejo de procesos

## 📦 Instalación

### Para scripts con ventanas separadas (`start_separate.bat`)
**No requiere instalación adicional**, solo PowerShell (incluido en Windows).

### Para scripts de Python
Los scripts `.bat` instalarán automáticamente las dependencias necesarias (`psutil`).

**Instalación manual (opcional):**
```bash
pip install -r requirements.txt
```

## 🚀 Uso

### 🥇 Opción 1: Inicio Rápido en Ventanas Separadas (MÁS RECOMENDADO) ⭐⭐⭐
```bash
.\start_separate.bat
```
- **Ventaja**: Cada servidor en su propia ventana
- **Ventaja**: No requiere Python
- **Ventaja**: Muy simple y rápido
- **Control**: Cierra cada ventana individualmente con Ctrl+C
- **Detener todo**: Ejecuta `.\stop_servers.bat`

### 🥈 Opción 2: Manager con Ventanas Separadas y Menú
```bash
.\start_windows.bat
```
- **Ventaja**: Control centralizado con menú
- **Ventaja**: Monitoreo de estado por PID
- **Control**: Opciones para iniciar/detener servidores individuales

### 🥉 Opción 3: Versión mejorada en una sola ventana
```bash
.\start_v2.bat
```
- **Ventaja**: Una sola ventana con logs combinados
- **Control**: Ctrl+C para detener todo

## 📖 Menú de Opciones

1. **🚀 Iniciar ambos servidores** - Inicia Laravel y Vite simultáneamente
2. **⏹️ Detener ambos servidores** - Detiene ambos servidores de forma segura
3. **🔧 Iniciar solo backend** - Inicia únicamente el servidor Laravel
4. **🔧 Iniciar solo frontend** - Inicia únicamente el servidor Vite
5. **⏹️ Detener solo backend** - Detiene únicamente Laravel
6. **⏹️ Detener solo frontend** - Detiene únicamente Vite
7. **📊 Ver estado de los servidores** - Muestra el estado actual
8. **🔄 Reiniciar ambos servidores** - Reinicia ambos servidores
9. **❌ Salir** - Cierra el programa y detiene todos los servidores

## 🌐 URLs por defecto

- **Backend (Laravel)**: http://localhost:8000
- **Frontend (Vite)**: http://localhost:5173

## ⌨️ Atajos de teclado

- **Ctrl+C**: Detiene todos los servidores y cierra el programa de forma segura

## 📝 Notas

- Los logs de ambos servidores se muestran en tiempo real con prefijos de colores
- El script verifica automáticamente que existan los directorios de backend y frontend
- Al cerrar el programa (opción 9 o Ctrl+C), se detienen automáticamente todos los servidores activos

## 🐛 Solución de problemas

### Los servidores no inician
- Verifica que PHP esté en el PATH del sistema
- Verifica que Node.js y npm estén instalados
- Asegúrate de que los puertos 8000 y 5173 no estén ocupados

### Ctrl+C no funciona correctamente
- **Solución**: Usa `start_v2.bat` o `server_manager_v2.py` 
- Estos scripts usan `taskkill` en Windows para terminar correctamente los procesos
- Si el problema persiste, cierra la ventana de PowerShell directamente

### Error al detener servidores
- Los scripts ahora usan `taskkill /F /T` en Windows para forzar el cierre
- Esto termina el árbol completo de procesos (PHP y Node.js con todos sus hijos)
- Si algún proceso queda activo, puedes usar Task Manager (Ctrl+Shift+Esc) para terminarlo manualmente

### Procesos zombies después de cerrar
- Ejecuta: `taskkill /F /IM node.exe /T` para Node.js
- Ejecuta: `taskkill /F /IM php.exe /T` para PHP
- O usa la versión mejorada (`start_v2.bat`) que maneja esto automáticamente

## 📄 Licencia

Parte del proyecto AquaTenex
