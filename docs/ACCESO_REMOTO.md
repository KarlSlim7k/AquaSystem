# 🌍 AquaTenex - Guía de Acceso Remoto

## 📋 Resumen

Este sistema está configurado para ser accesible desde cualquier dispositivo usando **VS Code Dev Tunnels**.

## 🚀 Inicio Rápido

### Opción 1: Script Automático (Recomendado)
```bash
# Ejecutar el script de inicio con acceso remoto
server_manager\start_remote_access.bat
```

### Opción 2: Manual
1. Asegúrate de que **Apache esté corriendo** (XAMPP Control Panel)
2. Inicia el frontend: `cd frontend && npm run dev`
3. Configura los tunnels en VS Code (ver sección siguiente)

## 🔧 Configuración de VS Code Tunnels

### Paso 1: Abrir Panel de Puertos
1. En VS Code, presiona `Ctrl+Shift+P`
2. Escribe "Ports: Focus on Ports View"
3. O haz clic en la pestaña **PORTS** en el panel inferior

### Paso 2: Configurar Puertos

#### Puerto 443 (Backend - Apache)
- Debería aparecer automáticamente si Apache está corriendo
- Si no aparece, agrega manualmente: Click en "Add Port" → escribe `443`
- **Importante:** Cambia a "Public" (click derecho → Port Visibility → Public)
- URL resultante: `https://xxxxx-443.usw3.devtunnels.ms`

#### Puerto 5173 (Frontend - Vite)
- Aparece automáticamente cuando ejecutas `npm run dev`
- **Importante:** Cambia a "Public" (click derecho → Port Visibility → Public)
- URL resultante: `https://xxxxx-5173.usw3.devtunnels.ms`

### Paso 3: Actualizar URLs si Cambian
Si los tunnels generan URLs diferentes, actualiza:

**Frontend** (`frontend/src/services/api.js`):
```javascript
const API_BASE_URL = 'https://TU-NUEVA-URL-443.usw3.devtunnels.ms';
```

## 📡 URLs de Acceso

### 🏠 Acceso Local
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost/api

### 🌍 Acceso Remoto (desde cualquier dispositivo)
- **Frontend:** https://fs151wjc-5173.usw3.devtunnels.ms
- **Backend:** https://fs151wjc-443.usw3.devtunnels.ms/api

> ⚠️ **Nota:** Las URLs de tunnel pueden cambiar. Verifica en VS Code → PORTS.

## ✅ Verificar Estado

Ejecuta este script para verificar que todo esté corriendo:
```bash
server_manager\check_status.bat
```

## 🔐 Usuarios de Prueba

### Administrador
- **Usuario:** admin
- **Contraseña:** admin123

### Censador
- **Usuario:** censador
- **Contraseña:** censador123

## 🛠️ Arquitectura

```
┌─────────────────────────────────────────┐
│     Dispositivo Remoto (cualquiera)     │
│                                          │
│  📱 Teléfono / 💻 Laptop / 🖥️ PC        │
└─────────────┬───────────────────────────┘
              │
              │ HTTPS (VS Code Tunnels)
              ▼
┌─────────────────────────────────────────┐
│          Computadora Local              │
│                                          │
│  ┌────────────┐      ┌────────────┐    │
│  │  Frontend  │      │  Backend   │    │
│  │  Vite:5173 │──────│Apache:443  │    │
│  └────────────┘      └──────┬─────┘    │
│                              │          │
│                       ┌──────▼─────┐    │
│                       │   MySQL    │    │
│                       │   :3306    │    │
│                       └────────────┘    │
└─────────────────────────────────────────┘
```

## 📝 Configuración Actual

### Backend
- ✅ Apache sirviendo Laravel desde puerto 443 (HTTPS)
- ✅ DocumentRoot apuntando a `backend/public`
- ✅ CORS configurado para tunnels
- ✅ Sanctum usando Bearer tokens

### Frontend
- ✅ URL del backend hardcodeada en `api.js`
- ✅ Configurado para usar tunnel del puerto 443
- ✅ Vite corriendo en puerto 5173

## 🐛 Solución de Problemas

### Error: "Cannot connect to backend"
1. Verifica que Apache esté corriendo
2. Verifica que el puerto 443 esté en "Public" en VS Code
3. Ejecuta `check_status.bat` para ver el estado

### Error: "Login failed"
1. Limpia caché del navegador (Ctrl+Shift+Delete)
2. Recarga con Ctrl+Shift+R
3. Verifica la URL en la consola del navegador (F12)

### El frontend muestra localhost:8000
1. Asegúrate de haber reiniciado Vite después de cambiar el código
2. Limpia caché del navegador
3. Abre en modo incógnito para probar

### Service Worker causa problemas de caché
1. Abre DevTools (F12)
2. Ve a Application → Service Workers
3. Click en "Unregister" en todos los service workers
4. Recarga la página

## 💡 Tips

- **Tunnels son temporales:** Las URLs pueden cambiar si reinicias VS Code
- **Mantén VS Code abierto:** Los tunnels solo funcionan mientras VS Code esté corriendo
- **Puerto 443 es estable:** Usa Apache (puerto 443) en lugar de `php artisan serve` (puerto 8000)
- **Limpia caché frecuentemente:** Los cambios en frontend requieren limpiar caché del navegador

## 📞 Soporte

Si encuentras problemas:
1. Ejecuta `check_status.bat` y revisa qué servicios no están corriendo
2. Verifica los logs de Apache en `C:\xampp\apache\logs\error.log`
3. Revisa la consola del navegador (F12) para errores de JavaScript
