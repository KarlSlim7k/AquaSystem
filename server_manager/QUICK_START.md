# 🚀 Server Manager - Guía de Inicio Rápido

## ⚡ Inicio más rápido (Recomendado)

### Para iniciar los servidores:
```bash
.\start_separate.bat
```
Esto abrirá 2 ventanas de PowerShell (una para backend, otra para frontend).

### Para detener los servidores:
- **Opción 1**: Cierra cada ventana individualmente con Ctrl+C
- **Opción 2**: Ejecuta `.\stop_servers.bat`

---

## 📋 Todos los scripts disponibles

### Scripts de Inicio

| Script | Descripción | Ventanas | Python |
|--------|-------------|----------|---------|
| `start_separate.bat` ⭐⭐⭐ | Inicio rápido, cada servidor en su ventana | 2 separadas | ❌ No |
| `start_windows.bat` ⭐⭐ | Menú de control + ventanas separadas | 2 + control | ✅ Sí |
| `start_v2.bat` ⭐ | Logs combinados en una ventana | 1 única | ✅ Sí |
| `start_servers.bat` | Menú interactivo completo | 1 única | ✅ Sí |
| `quick_start.bat` | Inicio rápido sin menú | 1 única | ✅ Sí |

### Scripts de Control

| Script | Descripción |
|--------|-------------|
| `stop_servers.bat` | Detiene todos los servidores (Node.js y PHP) |
| `check_requirements.bat` | Verifica que todo esté instalado correctamente |

---

## 🎯 ¿Cuál usar?

### 👨‍💻 Para desarrollo diario
**Usa**: `start_separate.bat`
- Simple y directo
- Cada servidor visible en su ventana
- No requiere Python

### 🎮 Si quieres más control
**Usa**: `start_windows.bat`
- Menú con opciones
- Monitoreo de estado
- Control individual de servidores

### 📊 Si prefieres todo en una ventana
**Usa**: `start_v2.bat`
- Logs combinados
- Una sola ventana
- Ctrl+C para detener todo

---

## 🔧 Primera vez

1. **Verifica los requisitos**:
   ```bash
   .\check_requirements.bat
   ```

2. **Inicia los servidores**:
   ```bash
   .\start_separate.bat
   ```

3. **Accede a la aplicación**:
   - Backend: http://localhost:8000
   - Frontend: http://localhost:5173

4. **Cuando termines**:
   ```bash
   .\stop_servers.bat
   ```

---

## ❓ Solución de problemas

### Los servidores no inician
```bash
.\check_requirements.bat
```
Este script te dirá qué falta instalar.

### Quiero detener todo rápidamente
```bash
.\stop_servers.bat
```

### Error "puerto ya en uso"
Primero detén todos los servidores:
```bash
.\stop_servers.bat
```
Luego vuelve a iniciar.

---

## 📁 Estructura de archivos

```
server_manager/
├── start_separate.bat          ⭐ Inicio rápido (recomendado)
├── stop_servers.bat            🛑 Detener todo
├── check_requirements.bat      ✅ Verificar sistema
├── start_windows.bat           🎮 Menú con ventanas
├── start_v2.bat                📊 Una ventana
├── start_servers.bat           📋 Menú completo
├── quick_start.bat             🚀 Rápido sin menú
├── server_manager_windows.py   🐍 Manager con ventanas
├── server_manager_v2.py        🐍 Manager mejorado
├── server_manager.py           🐍 Manager original
├── quick_start.py              🐍 Quick start Python
├── requirements.txt            📦 Dependencias Python
├── config.py                   ⚙️ Configuración
├── README.md                   📖 Documentación completa
└── QUICK_START.md              ⚡ Esta guía
```

---

## 🎓 Tips

1. **Mantén las ventanas abiertas**: Verás los logs en tiempo real
2. **Usa Ctrl+C**: Para detener un servidor en su ventana
3. **Puerto ocupado**: Usa `stop_servers.bat` antes de reiniciar
4. **Verifica estado**: Ejecuta `check_requirements.bat` si algo falla

---

Para más información detallada, consulta [README.md](README.md)
