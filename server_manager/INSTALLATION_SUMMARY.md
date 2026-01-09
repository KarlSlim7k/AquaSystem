# 🎉 Sistema de Gestión de Servidores - Instalación Completa

## ✅ Scripts Creados

### 📁 Ubicación: `server_manager/`

#### 🚀 Scripts de Inicio

1. **`start_separate.bat`** ⭐⭐⭐ **[MÁS RECOMENDADO]**
   - Abre backend y frontend en ventanas PowerShell separadas
   - No requiere Python
   - Ctrl+C en cada ventana para detener
   - Uso: Doble clic o `.\start_separate.bat`

2. **`start_windows.bat`** ⭐⭐
   - Menú interactivo con control de ventanas separadas
   - Requiere Python + psutil (se instala automáticamente)
   - Monitoreo de procesos por PID
   - Uso: `.\start_windows.bat`

3. **`start_v2.bat`** ⭐
   - Logs combinados en una sola ventana
   - Requiere Python
   - Ctrl+C para detener todo
   - Uso: `.\start_v2.bat`

4. **`start_servers.bat`**
   - Menú completo con múltiples opciones
   - Requiere Python
   - Uso: `.\start_servers.bat`

5. **`quick_start.bat`**
   - Inicio rápido sin menú
   - Requiere Python
   - Uso: `.\quick_start.bat`

#### 🛑 Scripts de Control

6. **`stop_servers.bat`**
   - Detiene TODOS los procesos de Node.js y PHP
   - Confirmación antes de detener
   - Uso: `.\stop_servers.bat`

7. **`check_requirements.bat`**
   - Verifica que todo esté instalado
   - Muestra estado de Python, PHP, Node.js, npm
   - Verifica estructura del proyecto
   - Uso: `.\check_requirements.bat`

#### 🐍 Scripts Python

8. **`server_manager_windows.py`**
   - Backend del gestor con ventanas separadas
   - Usa psutil para monitoreo de procesos

9. **`server_manager_v2.py`**
   - Versión mejorada con mejor manejo de procesos

10. **`server_manager.py`**
    - Versión original con menú completo

11. **`quick_start.py`**
    - Versión Python de inicio rápido

#### 📄 Documentación

12. **`README.md`**
    - Documentación completa
    - Todas las características
    - Solución de problemas

13. **`QUICK_START.md`**
    - Guía de inicio rápido
    - Tabla comparativa de scripts
    - Tips y trucos

14. **`requirements.txt`**
    - Dependencias Python (psutil)

15. **`config.py`**
    - Configuración opcional personalizable

---

## 🎯 Uso Recomendado

### Para la primera vez:

```bash
cd server_manager
.\check_requirements.bat
```

### Para trabajo diario:

```bash
.\start_separate.bat
```

Esto abrirá:
- **Ventana 1**: Backend (Laravel) en http://localhost:8000
- **Ventana 2**: Frontend (Vite) en http://localhost:5173

### Para detener:

**Opción A**: Cierra cada ventana con Ctrl+C

**Opción B**: 
```bash
.\stop_servers.bat
```

---

## 📊 Comparación de Métodos

| Característica | start_separate | start_windows | start_v2 |
|---------------|----------------|---------------|----------|
| Ventanas separadas | ✅ Sí | ✅ Sí | ❌ No |
| Requiere Python | ❌ No | ✅ Sí | ✅ Sí |
| Menú control | ❌ No | ✅ Sí | ❌ No |
| Logs visibles | ✅ Ambos | ✅ Ambos | ✅ Combinados |
| Inicio rápido | ✅✅✅ | ✅✅ | ✅✅ |
| Fácil de usar | ✅✅✅ | ✅✅ | ✅✅ |

---

## 🔧 Requisitos del Sistema

✅ **Instalados y verificados**:
- Python 3.14.0
- PHP (XAMPP)
- Node.js v24.11.0
- npm

⚙️ **Opcionales**:
- Composer (para Laravel)
- psutil (se instala automáticamente)

---

## 💡 Tips

1. **Ventanas separadas son mejores** para ver logs de ambos servidores simultáneamente

2. **stop_servers.bat es tu amigo** cuando algo se atasca

3. **check_requirements.bat** es útil para diagnóstico

4. **Ctrl+C funciona correctamente** en todas las versiones corregidas

---

## 🐛 Solución de Problemas

### ❌ Error: "Puerto ya en uso"
```bash
.\stop_servers.bat
```
Luego reinicia los servidores.

### ❌ Ctrl+C no funciona
- Usa `start_separate.bat` o `start_v2.bat` (versiones corregidas)
- O usa `stop_servers.bat`

### ❌ "Python no encontrado"
El script `start_separate.bat` **NO requiere Python**, usa ese.

### ✅ Todo funciona
¡Perfecto! Usa `start_separate.bat` para tu trabajo diario.

---

## 📁 Estructura Final

```
server_manager/
├── 📜 QUICK_START.md              ← Empieza aquí
├── 📖 README.md                   ← Documentación completa
├── 📋 INSTALLATION_SUMMARY.md     ← Este archivo
│
├── 🚀 Scripts de Inicio:
│   ├── start_separate.bat         ⭐⭐⭐ MÁS RECOMENDADO
│   ├── start_windows.bat          ⭐⭐
│   ├── start_v2.bat               ⭐
│   ├── start_servers.bat
│   └── quick_start.bat
│
├── 🛑 Scripts de Control:
│   ├── stop_servers.bat           Detener todo
│   └── check_requirements.bat     Verificar sistema
│
├── 🐍 Scripts Python:
│   ├── server_manager_windows.py
│   ├── server_manager_v2.py
│   ├── server_manager.py
│   └── quick_start.py
│
└── 📦 Configuración:
    ├── requirements.txt
    └── config.py
```

---

## 🎓 Flujo de Trabajo Recomendado

```
1. Primera vez
   ├─ check_requirements.bat  (verificar)
   └─ start_separate.bat      (probar)

2. Trabajo diario
   ├─ start_separate.bat      (iniciar)
   ├─ [Trabajar en el código]
   └─ stop_servers.bat        (detener) o Ctrl+C en ventanas

3. Si hay problemas
   ├─ stop_servers.bat        (limpiar)
   ├─ check_requirements.bat  (verificar)
   └─ start_separate.bat      (reiniciar)
```

---

## ✨ Características Destacadas

✅ **Ctrl+C funciona correctamente** en todas las versiones
✅ **No quedan procesos zombies** gracias a taskkill
✅ **Ventanas separadas** para mejor visualización
✅ **Scripts batch simples** que no requieren Python
✅ **Instalación automática** de dependencias Python
✅ **Verificación de sistema** completa
✅ **Detención segura** de todos los servidores

---

## 🎉 ¡Listo para usar!

Ejecuta simplemente:
```bash
.\start_separate.bat
```

Y tendrás ambos servidores corriendo en ventanas separadas. 🚀
