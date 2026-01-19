# 💧 AquaTenex - Sistema Integral de Gestión de Pagos de Agua

> **Sistema profesional para la administración de pagos de servicios de agua potable con geolocalización, notificaciones y reportes avanzados**

![Status](https://img.shields.io/badge/Estado-Operativo-brightgreen)
![Version](https://img.shields.io/badge/Versión-1.0.0-blue)
![License](https://img.shields.io/badge/Licencia-MIT-green)
![PHP](https://img.shields.io/badge/PHP-8.2+-purple)
![Laravel](https://img.shields.io/badge/Laravel-12-red)
![React](https://img.shields.io/badge/React-19.1-cyan)
![Node.js](https://img.shields.io/badge/Node.js-Latest-green)

---

## 📑 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Características Principales](#-características-principales)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Módulos del Sistema](#-módulos-del-sistema)
- [API REST](#-api-rest)
- [Base de Datos](#-base-de-datos)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## 🎯 Descripción General

**AquaTenex** es un sistema integral de gestión de pagos para servicios de agua potable, diseñado especialmente para pequeñas y medianas localidades. Proporciona una solución completa que abarca desde el censo de usuarios hasta la generación de reportes y gestión de cobranzas.

### Ubicación
📍 **Calera Tenextepec - San Antonio Tenextepec, Veracruz, México**

### Casos de Uso Principales
- ✅ Gestión centralizada de usuarios del servicio de agua
- ✅ Registro y seguimiento de pagos en tiempo real
- ✅ Cálculo automático de adeudos y recargos por mora
- ✅ Generación de reportes y estadísticas
- ✅ Monitoreo geográfico de usuarios y rutas de cobro
- ✅ Notificaciones automáticas a usuarios morosos
- ✅ Auditoría completa de todas las operaciones

---

## ✨ Características Principales

### 👥 Gestión de Usuarios
- 📝 Registro completo de datos de usuarios (nombre, dirección, teléfono, email, ID)
- 📍 Captura automática de geolocalización (GPS)
- 📸 Fotografías de domicilios y medidores
- 🏠 Asignación automática de números de cuenta únicos
- ✏️ Edición y actualización de información
- 🔍 Búsqueda y filtrado avanzado
- 📊 Prevención de duplicados mediante validación inteligente

### 💰 Gestión de Pagos
- 💳 Registro flexible de pagos (efectivo, transferencia, tarjeta)
- 📄 Generación automática de recibos digitales
- 🧮 Cálculo automático de adeudos y períodos vencidos
- 📈 Aplicación automática de recargos por mora
- 📧 Envío de recibos por correo y WhatsApp
- 💸 Soporte para pagos parciales
- 🔄 Funcionalidad para cancelar/ajustar pagos registrados

### 📊 Reportes y Análisis
- 📅 Reportes diarios, mensuales y anuales
- 📈 Estadísticas de recaudación
- 👁️ Identificación de usuarios morosos
- 📊 Análisis por colonia o zona geográfica
- 📥 Exportación a PDF y Excel
- 💹 Gráficos interactivos y dashboards

### 🗺️ Geolocalización
- 🌍 Mapa interactivo con ubicación de todos los usuarios
- 🚗 Visualización de rutas de cobro optimizadas
- 🚨 Identificación visual de usuarios al corriente vs morosos
- 📍 Búsqueda por proximidad geográfica

### 🔔 Sistema de Notificaciones
- ⏰ Recordatorios automáticos de próximos vencimientos
- 📲 Alertas de pagos vencidos
- ✉️ Notificaciones por correo y SMS
- 🔊 Avisos de cortes programados

### 🔐 Seguridad y Administración
- 🔒 Autenticación con JWT (Laravel Sanctum)
- 🔑 Cifrado bcrypt de contraseñas
- 👨‍💼 Gestión de usuarios del sistema con roles
- 📋 Bitácora completa de auditoría
- 🛡️ Control de permisos granular
- 💾 Respaldos automáticos de base de datos

---

## 🚀 Stack Tecnológico

### Frontend
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **React** | 19.1+ | Framework UI principal |
| **Vite** | 7.1+ | Bundler y dev server |
| **Redux Toolkit** | 2.10+ | Gestión de estado |
| **Tailwind CSS** | 3.4+ | Estilos y diseño responsivo |
| **Leaflet/React-Leaflet** | 1.9+/5.0+ | Mapas interactivos |
| **React Hook Form** | 7.66+ | Manejo de formularios |
| **Axios** | 1.13+ | Cliente HTTP |
| **Chart.js** | 4.5+ | Gráficas y estadísticas |
| **React Router** | 7.9+ | Enrutamiento SPA |

### Backend
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **Laravel** | 12+ | Framework web |
| **PHP** | 8.2+ | Lenguaje servidor |
| **Laravel Sanctum** | 4.2+ | Autenticación API/JWT |
| **Intervention Image** | 3.11+ | Procesamiento de imágenes |
| **DomPDF** | 3.1+ | Generación de PDFs |
| **PHPUnit** | 11.5+ | Testing |

### Base de Datos
| Tecnología | Versión |
|-----------|---------|
| **MySQL** | 5.7+ |
| **MariaDB** | 10.4+ |

### DevOps y Herramientas
- **Composer** - Gestor de dependencias PHP
- **npm** - Gestor de paquetes Node.js
- **Docker** - Containerización (opcional)
- **Git** - Control de versiones

---

## 📂 Estructura del Proyecto

```
Proyecto_CT/
├── 📁 backend/                    # API REST (Laravel)
│   ├── app/                       # Código de aplicación
│   │   ├── Http/                  # Controladores y middlewares
│   │   └── Models/                # Modelos Eloquent
│   ├── config/                    # Archivos de configuración
│   ├── database/                  # Migraciones y seeders
│   ├── routes/                    # Definición de rutas API
│   ├── storage/                   # Archivos y logs
│   ├── tests/                     # Tests unitarios y feature
│   ├── composer.json              # Dependencias PHP
│   └── artisan                    # CLI de Laravel
│
├── 📁 frontend/                   # Interfaz de usuario (React)
│   ├── src/                       # Código fuente React
│   │   ├── components/            # Componentes React
│   │   ├── pages/                 # Páginas de la aplicación
│   │   ├── store/                 # Redux store
│   │   ├── services/              # Servicios API
│   │   └── App.jsx                # Componente raíz
│   ├── public/                    # Assets estáticos
│   ├── package.json               # Dependencias Node.js
│   ├── vite.config.js             # Configuración Vite
│   ├── tailwind.config.js         # Configuración Tailwind
│   └── index.html                 # HTML principal
│
├── 📁 database/                   # Scripts SQL
│   ├── aquatenex_db.sql           # Base de datos principal
│   ├── add_tipo_propiedad.sql     # Migraciones
│   └── insert_usuario_censador.sql
│
├── 📁 server_manager/             # Gestión de servidores
│   ├── server_manager.py          # Gestor principal (Python)
│   ├── start_separate.bat         # Inicio en ventanas (Windows)
│   ├── start_servers.bat          # Inicio combinado
│   └── stop_servers.bat           # Detener servicios
│
├── 📁 scripts/                    # Scripts de utilidad
│   ├── password_manager.py        # Gestor de contraseñas
│   └── test_*.py                  # Tests Python
│
├── 📁 utils/                      # Utilidades
│   ├── crear_usuario_censador.py  # Creación de usuarios
│   ├── generar_hash.py            # Generador de hashes
│   └── verificar_censador.py      # Validación de usuarios
│
├── 📁 docs/                       # Documentación
│   ├── FASES_DESARROLLO_*.md      # Registro de fases
│   ├── CAMBIO_TIPO_PROPIEDAD.md   # Guías de operación
│   ├── README.md                  # Documentación principal
│   └── test_sistema.ps1           # Script de testing
│
├── 📁 php/                        # Scripts PHP auxiliares
│   └── AquaTenexAuth.php          # Autenticación PHP
│
├── stack.md                       # Definición del stack
├── text.md                        # Requisitos del sistema
└── README.md                      # Este archivo
```

---

## 📋 Requisitos Previos

### Mínimos
- **PHP 8.2+** (con extensiones: PDO, MySQL, OpenSSL)
- **Node.js 18+** y **npm 9+**
- **MySQL 5.7+** o **MariaDB 10.4+**
- **Composer** (gestor de paquetes PHP)
- **Git** (control de versiones)

### Opcionales
- **Docker** (para containerización)
- **Visual Studio Code** (editor recomendado)
- **Postman** (para testing de API)

### Sistemas Operativos Soportados
- ✅ Windows 10/11 (PowerShell)
- ✅ macOS 10.15+
- ✅ Linux (Ubuntu 20.04+, Debian 11+)

---

## 🛠️ Instalación

### Opción 1: Instalación Manual Completa

#### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd Proyecto_CT
```

#### 2. Configurar Backend (Laravel)
```bash
cd backend

# Instalar dependencias PHP
composer install

# Copiar archivo de configuración
cp .env.example .env

# Generar clave de aplicación
php artisan key:generate

# Migrar base de datos
php artisan migrate --seed

# Instalar dependencias de Node para assets
npm install
npm run build

cd ..
```

#### 3. Configurar Frontend (React)
```bash
cd frontend

# Instalar dependencias
npm install

# Compilar para desarrollo
npm run dev

# O compilar para producción
npm run build

cd ..
```

#### 4. Importar Base de Datos
```bash
# En MySQL/MariaDB
mysql -u root -p aquatenex_db < database/aquatenex_db.sql
```

#### 5. Configurar credenciales por defecto
```bash
# Usar el gestor de contraseñas
cd scripts
python password_manager.py
```

### Opción 2: Instalación Rápida (Windows)

#### Scripts disponibles:
```bash
# Instalación de dependencias
.\instalar_dependencias.bat

# Inicio rápido en ventanas separadas (RECOMENDADO)
.\server_manager\start_separate.bat

# O inicio combinado
.\server_manager\start_servers.bat
```

### Opción 3: Usando Docker (Opcional)

```bash
# Construcción
docker-compose build

# Ejecución
docker-compose up -d

# Migraciones
docker-compose exec backend php artisan migrate --seed
```

---

## 🚀 Uso

### Inicio del Sistema (Desarrollo)

#### Opción 1: Inicio Rápido (Recomendado)
```bash
# Windows
.\server_manager\start_separate.bat

# macOS/Linux
cd server_manager && python3 server_manager.py
```

#### Opción 2: Inicio Manual
```bash
# Terminal 1: Backend
cd backend
php artisan serve

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Queue (opcional pero recomendado)
cd backend
php artisan queue:listen
```

### Acceso a la Aplicación
- 🌐 **Frontend:** http://localhost:5173
- 🔧 **API Backend:** http://localhost:8000/api
- 📚 **Documentación API:** http://localhost:8000/api/docs

### Credenciales por Defecto
```
Usuario: admin
Contraseña: admin123
```

⚠️ **IMPORTANTE:** Cambiar credenciales en producción

### Detener el Sistema
```bash
# Windows
.\server_manager\stop_servers.bat

# macOS/Linux
Ctrl+C en el terminal
```

---

## 📦 Módulos del Sistema

### 1. Módulo de Censo y Registro de Usuarios
Gestión completa del padrón de usuarios con:
- Registro de datos personales
- Captura de geolocalización GPS
- Fotografía del domicilio
- Asignación automática de números de cuenta
- Validación de duplicados

**Endpoints clave:**
- `POST /api/usuarios` - Crear usuario
- `GET /api/usuarios` - Listar usuarios
- `GET /api/usuarios/{id}` - Detalle de usuario
- `PUT /api/usuarios/{id}` - Actualizar usuario

### 2. Módulo de Gestión de Pagos
Control de pagos e ingresos:
- Registro de pagos con múltiples métodos
- Generación automática de recibos
- Cálculo de adeudos y recargos
- Historial de transacciones
- Exportación de recibos

**Endpoints clave:**
- `POST /api/pagos` - Registrar pago
- `GET /api/pagos` - Listar pagos
- `GET /api/pagos/{id}/recibo` - Descargar recibo PDF
- `PUT /api/pagos/{id}` - Ajustar pago

### 3. Módulo de Reportes
Análisis y estadísticas:
- Reportes por período (diarios, mensuales, anuales)
- Estadísticas de recaudación
- Identificación de usuarios morosos
- Análisis por colonia/zona
- Exportación a PDF/Excel

**Endpoints clave:**
- `GET /api/reportes/recaudacion` - Estadísticas
- `GET /api/reportes/morosos` - Usuarios en mora
- `GET /api/reportes/por-colonia` - Análisis por zona

### 4. Módulo de Geolocalización
Visualización y análisis espacial:
- Mapa interactivo con todos los usuarios
- Rutas de cobro optimizadas
- Identificación visual de estado (al corriente/moroso)
- Búsqueda por proximidad

**Características:**
- Integración con Leaflet.js
- Markers personalizados por estado
- Clustering automático

### 5. Módulo de Administración
Control del sistema:
- Gestión de usuarios operadores
- Configuración de tarifas
- Gestión de respaldos
- Bitácora de auditoría
- Configuración general

**Endpoints clave:**
- `GET/POST /api/admin/configuracion` - Tarifas y config
- `GET /api/admin/usuarios-sistema` - Usuarios operadores
- `GET /api/admin/bitacora` - Auditoría

### 6. Módulo de Notificaciones
Sistema de alertas:
- Recordatorios de vencimiento
- Alertas de pagos vencidos
- Notificaciones de cortes programados
- Integración con email/SMS/WhatsApp

---

## 🔌 API REST

### Estructura Base
```
GET    /api/recurso              # Listar
POST   /api/recurso              # Crear
GET    /api/recurso/{id}         # Obtener uno
PUT    /api/recurso/{id}         # Actualizar
DELETE /api/recurso/{id}         # Eliminar
```

### Autenticación
Todos los endpoints (excepto login) requieren token Bearer:
```bash
Authorization: Bearer {token}
```

### Respuestas
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": { ... },
  "errors": null
}
```

### Ejemplos de Uso

#### Login
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@aquatenex.com",
    "password": "admin123"
  }'
```

#### Crear Usuario
```bash
curl -X POST http://localhost:8000/api/usuarios \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "telefono": "2711234567",
    "direccion": "Calle Principal 123",
    "latitud": 18.5,
    "longitud": -97.5
  }'
```

#### Registrar Pago
```bash
curl -X POST http://localhost:8000/api/pagos \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 1,
    "monto": 250.00,
    "metodo": "efectivo",
    "periodo": "2026-01"
  }'
```

---

## 🗄️ Base de Datos

### Tablas Principales

#### `usuarios_agua`
Padrón de usuarios del servicio
```sql
- id (PK)
- nombre
- email
- telefono
- direccion
- numero_cuenta (UNIQUE)
- latitud, longitud (Geolocalización)
- foto_domicilio
- foto_medidor
- estado (activo/inactivo)
- fecha_registro
```

#### `pagos`
Registro histórico de pagos
```sql
- id (PK)
- usuario_id (FK)
- monto
- metodo_pago
- periodo
- numero_recibo (UNIQUE)
- fecha_pago
- usuario_registra_id (FK)
```

#### `estado_cuenta`
Estado actual de cada usuario
```sql
- id (PK)
- usuario_id (UNIQUE FK)
- saldo_adeudo
- ultimas_3_morosos (bool)
- fecha_ultimo_pago
```

#### `configuracion_tarifas`
Tarifas y recargos
```sql
- id (PK)
- tarifa_basica
- tarifa_consumo_m3
- recargo_mora_diario (%)
- dias_vencimiento
- dias_antes_corte
```

#### `usuarios_sistema`
Operadores del sistema
```sql
- id (PK)
- nombre
- email
- password (bcrypt)
- rol (admin/cobradores/censador)
- activo
```

#### `bitacora_sistema`
Auditoría completa
```sql
- id (PK)
- usuario_id (FK)
- accion
- tabla
- registro_id
- valores_anteriores
- valores_nuevos
- ip
- timestamp
```

### Vistas Útiles
- `v_usuarios_morosos` - Usuarios en mora
- `v_recaudacion_mes` - Ingresos mensuales
- `v_estado_general` - Dashboard general
- `v_usuarios_por_colonia` - Agrupación por zona

### Procedimientos Almacenados
- `sp_calcular_adeudo` - Cálculo de deudas
- `sp_generar_recibo` - Generación de recibos
- `sp_procesar_vencimientos` - Procesamiento de vencimientos

---

## 🧪 Testing

### Tests Backend (Laravel)
```bash
cd backend

# Ejecutar todos los tests
php artisan test

# Tests específicos
php artisan test --filter=TestNombreTest

# Con coverage
php artisan test --coverage
```

### Tests Frontend (React)
```bash
cd frontend

# Ejecutar tests
npm test

# Con coverage
npm test -- --coverage
```

### Tests de Sistema
```bash
# Windows PowerShell
.\docs\test_sistema.ps1

# Python
python tests/test_censador_final.py
```

---

## 📝 Configuración

### Variables de Entorno Backend (`.env`)
```env
APP_NAME=AquaTenex
APP_ENV=production
APP_DEBUG=false
APP_URL=http://aquatenex.local

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=aquatenex_db
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=465
MAIL_USERNAME=
MAIL_PASSWORD=
```

### Variables de Entorno Frontend (`.env`)
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=AquaTenex
VITE_MAP_TOKEN=your_mapbox_token
```

---

## 🔒 Seguridad

### Prácticas Implementadas
- ✅ Hashing bcrypt de contraseñas
- ✅ JWT para autenticación API
- ✅ CORS configurado
- ✅ Rate limiting en endpoints sensibles
- ✅ Validación de entrada en todos los formularios
- ✅ Protección contra CSRF
- ✅ SQL Injection prevención (Eloquent ORM)
- ✅ XSS Protection
- ✅ Bitácora completa de auditoría

### Checklist de Seguridad Producción
- [ ] Cambiar credenciales por defecto
- [ ] Habilitar HTTPS/SSL
- [ ] Configurar firewall
- [ ] Implementar 2FA
- [ ] Actualizar todas las dependencias
- [ ] Realizar backup de BD regularmente
- [ ] Monitorear logs de error
- [ ] Configurar respuesta a incidentes

---

## 🐛 Troubleshooting

### Problema: Error de conexión a BD
```bash
# Verificar credenciales en .env
# Reiniciar MySQL/MariaDB
# Ejecutar migraciones nuevamente
php artisan migrate
```

### Problema: Puertos ya en uso
```bash
# Cambiar puertos en configuración
# Frontend: vite.config.js
# Backend: .env (APP_URL)
```

### Problema: Módulos npm no encontrados
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Problema: Errores de permisos en storage
```bash
cd backend
chmod -R 755 storage bootstrap/cache
php artisan storage:link
```

---

## 📚 Documentación Adicional

Consulta los siguientes archivos para información específica:

- [stack.md](stack.md) - Stack técnico detallado
- [text.md](text.md) - Requisitos funcionales
- [docs/README.md](docs/README.md) - Documentación completa
- [docs/FASES_DESARROLLO_PROTOTIPO.md](docs/FASES_DESARROLLO_PROTOTIPO.md) - Historial de desarrollo
- [server_manager/README.md](server_manager/README.md) - Gestión de servidores
- [docs/CONTEXTO_DESARROLLO_ANDROID.md](docs/CONTEXTO_DESARROLLO_ANDROID.md) - Integración Android

---

---

## 👥 Autores

- **Equipo de DevelomentGroup7k**
- Versión actual: 1.0.0
- Última actualización: 9 de enero de 2026

---

## 📊 Estado del Proyecto

| Aspecto | Estado | Descripción |
|---------|--------|-------------|
| Backend | ✅ Completo | API REST funcional |
| Frontend | ✅ Completo | Interfaz de usuario operativa |
| Base de Datos | ✅ Completo | Estructura y scripts listos |
| Documentación | ✅ Completo | Documentación comprehensiva |
| Testing | 🟡 Parcial | Tests unitarios y de feature |
| Producción | 🟡 En proceso | En fase de ajustes finales |

---

