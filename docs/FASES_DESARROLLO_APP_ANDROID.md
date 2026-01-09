# 📱 Plan de Fases - Desarrollo App Android AquaTenex (Censadores)

> **Objetivo**: Desarrollar versión móvil MVP para censadores en campo
> **Plataforma**: Android nativo con Kotlin + Jetpack Compose
> **Backend**: API REST Laravel existente

---

## 🎯 **FASE 1: Configuración Base (1-2 días)**

### Tareas:
- [x] Proyecto Android creado en Android Studio
- [ ] Dependencias sincronizadas en `build.gradle.kts`:
  - Retrofit + OkHttp (API REST)
  - Room Database (almacenamiento local)
  - Coroutines (operaciones asíncronas)
  - Navigation Compose (navegación)
  - DataStore (guardar token)
  - WorkManager (sincronización)
  - Location Services (GPS)
- [ ] Estructura de carpetas MVVM:
  ```
  app/src/main/java/com/tecperote/aquatenex/
  ├── data/
  │   ├── local/      # Room DB
  │   ├── remote/     # Retrofit API
  │   └── repository/ # Repositorios
  ├── domain/
  │   └── model/      # Modelos de negocio
  ├── presentation/
  │   ├── login/
  │   ├── censos/
  │   └── components/ # UI reutilizables
  └── utils/          # Helpers
  ```
- [ ] Configurar permisos en `AndroidManifest.xml`:
  - `INTERNET`
  - `ACCESS_FINE_LOCATION`
  - `ACCESS_COARSE_LOCATION`
- [ ] Prueba de conexión básica a API Laravel (ping test)

### Entregable:
✅ Proyecto compila sin errores y muestra pantalla inicial

---

## 🔐 **FASE 2: Autenticación (2-3 días)**

### Tareas:
- [ ] **UI Login Screen** (Jetpack Compose):
  - Campos: usuario/email, contraseña
  - Botón de login
  - Loading state
  - Mensajes de error
- [ ] **Retrofit API Service**:
  - Interface `AuthApiService`
  - Endpoint `POST /api/login`
  - Data class `LoginRequest`, `LoginResponse`
- [ ] **Repository Pattern**:
  - `AuthRepository` para manejar lógica de autenticación
- [ ] **DataStore**: Guardar token de Sanctum localmente
- [ ] **OkHttp Interceptor**: 
  - Agregar automáticamente `Authorization: Bearer {token}` a peticiones
- [ ] **ViewModel**: `LoginViewModel` con estados (Loading, Success, Error)
- [ ] **Navegación**: Redirigir a pantalla principal tras login exitoso
- [ ] **Auto-login**: Verificar token al abrir app

### Entregable:
✅ Usuario puede iniciar sesión y el token se guarda correctamente

---

## 📝 **FASE 3: Lista de Censos (3-4 días)**

### Tareas:
- [ ] **API Endpoint**: Consumir `GET /api/censos` (filtrar por censador autenticado)
- [ ] **Room Database**:
  - Entity `CensoEntity`
  - DAO `CensoDao` (insert, update, getAll, delete)
  - Database class
- [ ] **Repository**: `CensoRepository`
  - Fetch desde API
  - Guardar en Room
  - Leer desde Room (offline-first)
- [ ] **UI Lista Screen**:
  - `LazyColumn` con lista de censos
  - Card por cada censo con info básica
  - Pull-to-refresh
  - FAB para crear nuevo censo
- [ ] **ViewModel**: `CensosViewModel`
  - Estado de lista (Loading, Success, Error, Empty)
- [ ] **Navegación**: Click en censo → Detalle/Edición

### Entregable:
✅ Lista de censos se muestra desde API y funciona offline

---

## 📋 **FASE 4: Formulario de Censo (4-5 días)**

### Tareas:
- [ ] **UI Formulario**:
  - Campos según estructura Laravel (nombre, dirección, coordenadas, etc.)
  - TextField, Dropdown, DatePicker según tipo de dato
  - Validaciones en tiempo real
  - Botón "Guardar" y "Cancelar"
- [ ] **Geolocalización GPS**:
  - Solicitar permisos en runtime
  - Capturar lat/long automáticamente
  - Mostrar en mapa (opcional) o solo coordenadas
- [ ] **Guardar en Room**:
  - Campo `sincronizado` (boolean) para saber si ya se envió al servidor
  - Modo offline: guarda localmente
- [ ] **ViewModel**: `FormularioCensoViewModel`
  - Validación de campos requeridos
  - Estado del formulario
- [ ] **Modo Edición**: Cargar datos existentes para editar

### Entregable:
✅ Usuario puede crear/editar censos offline con validaciones y GPS

---

## 🔄 **FASE 5: Sincronización (3-4 días)**

### Tareas:
- [ ] **API Endpoint**: `POST /api/censos` para enviar censos al servidor
- [ ] **WorkManager**:
  - Worker `SincronizacionWorker`
  - Se ejecuta cuando hay conexión a internet
  - Envía censos con `sincronizado = false`
- [ ] **Constraints**: Solo sincronizar con WiFi (opcional) o cualquier conexión
- [ ] **UI Indicadores**:
  - Badge en lista mostrando censos pendientes de sincronizar
  - Botón manual "Sincronizar ahora"
  - Toast/Snackbar al completar sincronización
- [ ] **Manejo de errores**:
  - Retry automático en caso de fallo
  - Log de errores para debug
- [ ] **Actualizar Room**: Marcar censos como sincronizados tras éxito

### Entregable:
✅ Censos offline se sincronizan automáticamente al servidor

---

## 🎨 **FASE 6: Refinamiento UI/UX (2-3 días)**

### Tareas:
- [ ] **Material Design 3**:
  - Colores corporativos de AquaTenex
  - Tipografía consistente
  - Elevaciones y sombras
- [ ] **Estados visuales**:
  - Loading spinners
  - Empty states (sin censos)
  - Error screens con botón "Reintentar"
- [ ] **Feedback al usuario**:
  - Snackbars para acciones exitosas
  - Diálogos de confirmación (ej: eliminar censo)
- [ ] **Manejo global de errores**:
  - Interceptor para errores 401 (token inválido) → logout automático
  - Errores de red → mensaje amigable
- [ ] **Logout**:
  - Botón en menú
  - Limpiar token y datos locales
  - Regresar a Login
- [ ] **Splash Screen**: Logo de AquaTenex al iniciar

### Entregable:
✅ App con UI pulida, consistente y buena experiencia de usuario

---

## 🧪 **FASE 7: Testing y Deploy (2-3 días)**

### Tareas:
- [ ] **Testing**:
  - Pruebas en emulador (diferentes tamaños de pantalla)
  - Pruebas en dispositivo físico
  - Probar modo offline completo
  - Probar sincronización con API real
  - Casos edge: sin conexión, GPS desactivado, token expirado
- [ ] **Generar APK de prueba**:
  - Build → Generate Signed Bundle/APK
  - Versión Debug para testing interno
- [ ] **Corrección de bugs**:
  - Revisar crashs reportados
  - Optimizar performance
- [ ] **Documentación**:
  - README básico de la app Android
  - Endpoints API consumidos
  - Instrucciones de instalación APK

### Entregable:
✅ APK funcional listo para demostración y pruebas de campo

---

## ⏱️ **Resumen de Tiempo**

| Fase | Duración Estimada |
|------|-------------------|
| Fase 1: Configuración Base | 1-2 días |
| Fase 2: Autenticación | 2-3 días |
| Fase 3: Lista de Censos | 3-4 días |
| Fase 4: Formulario de Censo | 4-5 días |
| Fase 5: Sincronización | 3-4 días |
| Fase 6: Refinamiento UI/UX | 2-3 días |
| Fase 7: Testing y Deploy | 2-3 días |
| **TOTAL** | **17-24 días (~3-5 semanas)** |

---

## 📦 **Tecnologías Utilizadas**

### Android:
- **Lenguaje**: Kotlin
- **UI**: Jetpack Compose + Material Design 3
- **Arquitectura**: MVVM
- **Networking**: Retrofit 2 + OkHttp
- **Base de datos local**: Room
- **Asincronía**: Coroutines + Flow
- **Inyección de dependencias**: Hilt (opcional, Fase 2+)
- **Navegación**: Navigation Compose
- **Persistencia**: DataStore (SharedPreferences)
- **Background tasks**: WorkManager
- **Geolocalización**: Google Play Services Location

### Backend:
- **Framework**: Laravel 10+ (existente)
- **API**: REST con Sanctum para autenticación
- **Base de datos**: MySQL (existente)

---

## 🔗 **Endpoints API Necesarios**

### Autenticación:
- `POST /api/login` - Iniciar sesión (devuelve token)
- `POST /api/logout` - Cerrar sesión

### Censos:
- `GET /api/censos` - Listar censos del censador
- `GET /api/censos/{id}` - Detalle de censo
- `POST /api/censos` - Crear nuevo censo
- `PUT /api/censos/{id}` - Actualizar censo
- `DELETE /api/censos/{id}` - Eliminar censo (opcional)

---

## 📝 **Notas Importantes**

1. **Modo Offline First**: La app debe funcionar completamente sin conexión
2. **Validaciones**: Tanto en frontend (Android) como backend (Laravel)
3. **Seguridad**: 
   - Token en DataStore encriptado
   - HTTPS en producción
   - Sanitización de inputs
4. **UX**: Feedback inmediato al usuario en cada acción
5. **Performance**: Cargar lista con paginación si hay muchos censos

---

## ✅ **Checklist Final para Producción**

- [ ] App funciona offline completamente
- [ ] Sincronización automática probada
- [ ] Permisos GPS funcionan correctamente
- [ ] Autenticación segura con tokens
- [ ] UI responsive en diferentes tamaños de pantalla
- [ ] Manejo de errores robusto
- [ ] APK firmado para distribución
- [ ] Documentación completa

---

**Fecha de inicio**: _Por definir_  
**Fecha estimada de entrega MVP**: _3-5 semanas desde inicio_  
**Responsable**: Equipo de desarrollo AquaTenex
