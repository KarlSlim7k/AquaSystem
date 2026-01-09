# 🚀 FASES DE DESARROLLO - PROTOTIPO AQUATENEX

## 📋 Objetivo del Prototipo

Desarrollar un **prototipo funcional local** que demuestre el flujo de trabajo completo del rol **Gestor de Campo**, desde el censo de usuarios hasta el registro de pagos, ejecutándose en XAMPP con conexión a la base de datos MySQL.

---

## 🎯 Alcance del Prototipo

### **Rol Principal:** Gestor de Campo

**Funcionalidades a implementar:**
1. ✅ Autenticación (Login/Logout)
2. ✅ Dashboard con resumen de actividades
3. ✅ Registro de nuevos usuarios del servicio de agua (Censo)
4. ✅ Captura de geolocalización GPS
5. ✅ Captura de fotografías (domicilio y medidor)
6. ✅ Consulta y edición de usuarios existentes
7. ✅ Registro de pagos (actuales e históricos)
8. ✅ Visualización de estado de cuenta
9. ✅ Mapa interactivo con usuarios censados

---

## 📅 FASE 1: Configuración del Entorno (Días 1-2)

### **Objetivo:** Preparar el entorno de desarrollo local

### **Tareas:**

#### 1.1 Backend (Laravel)
```bash
# Crear proyecto Laravel en XAMPP
cd C:\xampp\htdocs\Proyecto_CT
composer create-project laravel/laravel backend

# Instalar dependencias adicionales
cd backend
composer require laravel/sanctum
composer require intervention/image
composer require barryvdh/laravel-dompdf
```

#### 1.2 Configurar base de datos
```env
# Editar backend/.env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=aquatenex_db
DB_USERNAME=root
DB_PASSWORD=
```

#### 1.3 Frontend (React)
```bash
# Crear proyecto React con Vite
cd C:\xampp\htdocs\Proyecto_CT
npm create vite@latest frontend -- --template react
cd frontend

# Instalar dependencias del stack
npm install axios react-router-dom
npm install @reduxjs/toolkit react-redux
npm install react-hook-form yup @hookform/resolvers
npm install leaflet react-leaflet
npm install chart.js react-chartjs-2
npm install react-toastify sweetalert2
npm install lucide-react
npm install date-fns
npm install tailwindcss postcss autoprefixer
npm install react-webcam
npm install @tanstack/react-table
```

#### 1.4 Configurar Tailwind CSS
```bash
cd frontend
npx tailwindcss init -p
```

### **Entregables:**
- ✅ Laravel instalado y corriendo en `http://localhost:8000`
- ✅ React instalado y corriendo en `http://localhost:5173`
- ✅ Conexión a base de datos verificada
- ✅ CORS configurado correctamente

---

## 📅 FASE 2: Backend API - Autenticación (Días 3-4)

### **Objetivo:** Implementar sistema de autenticación con Laravel Sanctum

### **Tareas:**

#### 2.1 Configurar Sanctum
```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

#### 2.2 Crear Modelos y Migraciones
```bash
php artisan make:model UsuarioSistema
php artisan make:model UsuarioAgua
php artisan make:model Pago
php artisan make:model EstadoCuenta
php artisan make:model BitacoraSistema
```

#### 2.3 Crear Controladores
```bash
php artisan make:controller Api/AuthController
php artisan make:controller Api/UsuarioAguaController
php artisan make:controller Api/PagoController
php artisan make:controller Api/DashboardController
```

#### 2.4 Rutas API Principales
```php
// routes/api.php
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
```

### **Entregables:**
- ✅ Login funcional que retorna JWT token
- ✅ Middleware de autenticación configurado
- ✅ Validación de rol 'gestor_campo'
- ✅ Logout con revocación de token

---

## 📅 FASE 3: Frontend - Autenticación y Layout (Días 5-6)

### **Objetivo:** Crear interfaz de login y estructura base de la aplicación

### **Tareas:**

#### 3.1 Configurar Redux Store
```javascript
// src/store/store.js
// Slices: authSlice, usuariosSlice, pagosSlice
```

#### 3.2 Páginas principales
- `Login.jsx` - Formulario de autenticación
- `Dashboard.jsx` - Panel principal del gestor de campo
- `Layout.jsx` - Estructura con navbar y sidebar

#### 3.3 Componentes reutilizables
- `Navbar.jsx` - Barra de navegación superior
- `Sidebar.jsx` - Menú lateral
- `PrivateRoute.jsx` - Protección de rutas

#### 3.4 Configurar Axios
```javascript
// src/api/axiosConfig.js
// Interceptores para token JWT
```

### **Entregables:**
- ✅ Login funcional con validación
- ✅ Persistencia de sesión (localStorage)
- ✅ Redirección automática según autenticación
- ✅ Layout responsivo con Tailwind

---

## 📅 FASE 4: Backend API - Gestión de Usuarios (Días 7-9)

### **Objetivo:** CRUD completo de usuarios del servicio de agua

### **Tareas:**

#### 4.1 Endpoints de Usuarios
```php
// Rutas protegidas con Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/usuarios-agua', [UsuarioAguaController::class, 'index']);
    Route::post('/usuarios-agua', [UsuarioAguaController::class, 'store']);
    Route::get('/usuarios-agua/{id}', [UsuarioAguaController::class, 'show']);
    Route::put('/usuarios-agua/{id}', [UsuarioAguaController::class, 'update']);
    Route::delete('/usuarios-agua/{id}', [UsuarioAguaController::class, 'destroy']);
});
```

#### 4.2 Validaciones
- Request Validation para datos personales
- Validación de duplicados (dirección)
- Validación de formato (teléfono, email, CP)

#### 4.3 Subida de imágenes
```php
// Intervention Image para optimizar fotos
// Storage en: storage/app/public/usuarios/{id}/
```

#### 4.4 Registro en bitácora
- Trigger automático en cada acción CRUD

### **Entregables:**
- ✅ API REST completa para usuarios
- ✅ Validaciones robustas
- ✅ Subida de imágenes optimizada
- ✅ Generación automática de número de cuenta
- ✅ Auditoría en bitácora

---

## 📅 FASE 5: Frontend - Módulo de Censo (Días 10-14)

### **Objetivo:** Interfaz completa para registro y gestión de usuarios

### **Tareas:**

#### 5.1 Páginas del módulo
- `UsuariosList.jsx` - Lista con tabla interactiva (TanStack Table)
- `UsuarioForm.jsx` - Formulario de registro/edición
- `UsuarioDetail.jsx` - Vista detallada de usuario
- `UsuarioMap.jsx` - Mapa con ubicaciones

#### 5.2 Funcionalidades clave

**Formulario de Registro:**
```javascript
// React Hook Form + Yup
- Validación en tiempo real
- Campos obligatorios marcados
- Mensajes de error claros
```

**Captura de Geolocalización:**
```javascript
// Geolocation API
- Botón "Obtener ubicación actual"
- Mostrar coordenadas en mapa (Leaflet)
- Permitir ajuste manual de marcador
```

**Captura de Fotografías:**
```javascript
// React Webcam
- Vista previa de cámara
- Captura de foto domicilio
- Captura de foto medidor
- Previsualización antes de guardar
```

#### 5.3 Tabla de usuarios
- Paginación
- Búsqueda por nombre/cuenta
- Filtros por colonia/estatus
- Acciones: Ver, Editar, Eliminar

### **Entregables:**
- ✅ Formulario funcional con validaciones
- ✅ Captura GPS operativa
- ✅ Captura de fotos con webcam
- ✅ Tabla interactiva con búsqueda/filtros
- ✅ Mapa con marcadores de usuarios

---

## 📅 FASE 6: Backend API - Gestión de Pagos (Días 15-17)

### **Objetivo:** Sistema completo de registro de pagos

### **Tareas:**

#### 6.1 Endpoints de Pagos
```php
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/pagos', [PagoController::class, 'store']);
    Route::get('/pagos/usuario/{id}', [PagoController::class, 'historial']);
    Route::get('/pagos/{id}/recibo', [PagoController::class, 'generarRecibo']);
    Route::post('/pagos/historico', [PagoController::class, 'registrarHistorico']);
});
```

#### 6.2 Lógica de negocio
- Cálculo automático de adeudos
- Aplicación de recargos por mora
- Generación de número de recibo
- Actualización de estado de cuenta (trigger)

#### 6.3 Generación de recibos PDF
```php
// DomPDF
- Diseño de plantilla de recibo
- Datos del pago
- Código QR (opcional)
```

#### 6.4 Procedimientos almacenados
- Llamar a `sp_recalcular_estado_cuenta()`
- Calcular adeudos con `sp_calcular_adeudo()`

### **Entregables:**
- ✅ API de pagos funcional
- ✅ Cálculo correcto de montos y recargos
- ✅ Generación de recibos PDF
- ✅ Actualización automática de estado de cuenta
- ✅ Registro de pagos históricos

---

## 📅 FASE 7: Frontend - Módulo de Pagos (Días 18-21)

### **Objetivo:** Interfaz para registro de pagos y consulta de estado de cuenta

### **Tareas:**

#### 7.1 Páginas del módulo
- `PagoForm.jsx` - Formulario de registro de pago
- `PagoHistorico.jsx` - Formulario para pagos anteriores
- `EstadoCuenta.jsx` - Visualización de cuenta del usuario
- `HistorialPagos.jsx` - Lista de pagos realizados

#### 7.2 Funcionalidades

**Registro de Pago:**
```javascript
// Flujo:
1. Buscar usuario por número de cuenta o nombre
2. Mostrar estado de cuenta actual
3. Calcular monto a pagar (con recargos si aplica)
4. Registrar pago
5. Generar recibo PDF
6. Opción de imprimir o guardar
```

**Registro Histórico:**
```javascript
// Campos adicionales:
- Fecha de pago anterior
- Periodo que cubre
- Observaciones
- Bandera "es_historico"
```

**Estado de Cuenta:**
```javascript
// Mostrar:
- Saldo pendiente
- Último pago
- Próximo vencimiento
- Historial de pagos (gráfica)
```

#### 7.3 Componentes
- `ReciboPDF.jsx` - Visor de recibo
- `CalculadoraPago.jsx` - Cálculo en tiempo real
- `TimelinePagos.jsx` - Línea de tiempo de pagos

### **Entregables:**
- ✅ Formulario de pago funcional
- ✅ Cálculo automático de montos
- ✅ Visualización de recibos
- ✅ Registro de pagos históricos
- ✅ Gráfica de historial de pagos

---

## 📅 FASE 8: Dashboard y Mapa Interactivo (Días 22-24)

### **Objetivo:** Panel de control con estadísticas y mapa general

### **Tareas:**

#### 8.1 Dashboard del Gestor de Campo
```javascript
// Widgets:
- Total de usuarios censados hoy
- Total de pagos registrados hoy
- Monto recaudado del día
- Usuarios pendientes de censar (si aplica)
```

#### 8.2 Mapa Interactivo (Leaflet)
```javascript
// Funcionalidades:
- Marcadores de todos los usuarios
- Colores por estatus de pago:
  * Verde: Al corriente
  * Amarillo: Próximo a vencer
  * Rojo: Moroso
- Popup con info básica al hacer clic
- Botón para ir a detalle del usuario
- Filtros por colonia o estatus
```

#### 8.3 Gráficas (Chart.js)
- Usuarios por colonia (gráfica de barras)
- Pagos del mes (gráfica de líneas)
- Distribución de estatus (gráfica de pastel)

### **Entregables:**
- ✅ Dashboard funcional con métricas en tiempo real
- ✅ Mapa interactivo con marcadores diferenciados
- ✅ Gráficas dinámicas
- ✅ Filtros operativos

---

## 📅 FASE 9: Optimización y PWA (Días 25-27)

### **Objetivo:** Mejorar rendimiento y agregar capacidades offline

### **Tareas:**

#### 9.1 Optimización de Backend
- Cache de consultas frecuentes (Redis)
- Optimización de queries (índices)
- Lazy loading de imágenes

#### 9.2 Optimización de Frontend
- Code splitting (React.lazy)
- Lazy loading de componentes pesados
- Optimización de bundle (Vite)
- Compresión de imágenes antes de subir

#### 9.3 Configuración PWA
```javascript
// Workbox
- Service Worker para cache
- Manifest.json
- Íconos en diferentes tamaños
- Estrategia de cache para API
```

#### 9.4 Modo offline básico
- Cache de usuarios consultados
- Cola de sincronización para pagos pendientes
- Indicador de estado de conexión

### **Entregables:**
- ✅ Aplicación optimizada (carga < 3s)
- ✅ PWA instalable en móvil
- ✅ Cache básico funcionando
- ✅ Cola de sincronización

---

## 📅 FASE 10: Testing y Documentación (Días 28-30)

### **Objetivo:** Pruebas completas y documentación del prototipo

### **Tareas:**

#### 10.1 Testing Backend
```bash
# PHPUnit
php artisan test

# Pruebas a realizar:
- Autenticación
- CRUD de usuarios
- Registro de pagos
- Cálculo de adeudos
- Generación de recibos
```

#### 10.2 Testing Frontend
```bash
# Jest + React Testing Library
npm run test

# Pruebas a realizar:
- Componentes principales
- Formularios
- Validaciones
- Flujo de autenticación
```

#### 10.3 Pruebas manuales
- Flujo completo: Login → Censar → Registrar Pago → Consultar
- Pruebas en diferentes navegadores
- Pruebas en dispositivos móviles
- Captura de fotos y GPS

#### 10.4 Documentación
- README.md con instrucciones de instalación
- Manual de usuario básico
- Guía de flujo del gestor de campo
- Documentación de API (Postman Collection)

### **Entregables:**
- ✅ Suite de pruebas ejecutándose
- ✅ Bugs críticos resueltos
- ✅ Documentación completa
- ✅ Video demo del prototipo

---

## 📦 ENTREGABLES FINALES DEL PROTOTIPO

### **1. Aplicación Funcional**
- Backend Laravel en `http://localhost:8000`
- Frontend React en `http://localhost:5173`
- Base de datos MySQL con datos de prueba

### **2. Funcionalidades Implementadas**
✅ Login/Logout con JWT
✅ Dashboard con métricas
✅ Censo completo de usuarios (CRUD)
✅ Captura GPS y fotografías
✅ Registro de pagos actuales e históricos
✅ Generación de recibos PDF
✅ Mapa interactivo con marcadores
✅ Gráficas de estadísticas
✅ PWA básica

### **3. Documentación**
- Manual de instalación
- Guía de usuario
- Colección Postman
- Video demo

---

## 🎯 CRITERIOS DE ÉXITO

El prototipo se considera exitoso si:

1. ✅ Un gestor de campo puede censarse con login
2. ✅ Puede registrar un nuevo usuario con GPS y fotos
3. ✅ Puede registrar un pago actual
4. ✅ Puede registrar un pago histórico
5. ✅ Puede consultar el estado de cuenta
6. ✅ Puede ver el mapa con usuarios censados
7. ✅ Los recibos PDF se generan correctamente
8. ✅ La aplicación funciona en móvil (responsive)

---

## 📊 CRONOGRAMA RESUMIDO

| Fase | Duración | Entregable Principal |
|------|----------|---------------------|
| 1. Configuración | 2 días | Entorno listo |
| 2. Backend Auth | 2 días | Login funcional |
| 3. Frontend Auth | 2 días | Interfaz de login |
| 4. Backend Usuarios | 3 días | API de censo |
| 5. Frontend Censo | 5 días | Módulo de censo |
| 6. Backend Pagos | 3 días | API de pagos |
| 7. Frontend Pagos | 4 días | Módulo de pagos |
| 8. Dashboard/Mapa | 3 días | Visualizaciones |
| 9. Optimización | 3 días | PWA funcional |
| 10. Testing | 3 días | Prototipo validado |

**TOTAL: 30 días (6 semanas)**

---

## 🚀 PRÓXIMOS PASOS DESPUÉS DEL PROTOTIPO

Una vez validado el prototipo, se podrá:
1. Agregar roles adicionales (admin, cobrador, etc.)
2. Implementar reportes avanzados
3. Integrar notificaciones (email/SMS)
4. Agregar módulo de configuración
5. Implementar respaldos automáticos
6. Desplegar en servidor de producción

---

## 📞 STACK TECNOLÓGICO CONFIRMADO

**Backend:**
- Laravel 10 + PHP 8.1
- MySQL 8.0
- Laravel Sanctum
- Intervention Image
- DomPDF

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- Redux Toolkit
- React Hook Form + Yup
- Leaflet + React-Leaflet
- Chart.js
- React Webcam
- Axios

**Entorno:**
- XAMPP (Apache + MySQL)
- phpMyAdmin
- VS Code

---

**Fecha de creación:** 5 de noviembre de 2025
**Versión:** 1.0
**Estado:** Planificación Inicial
