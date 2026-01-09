# 📱 Contexto de Desarrollo - App Android AquaTenex Censadores

> **Documento para asistentes de IA (Gemini, Copilot, etc.)**  
> Este archivo contiene el contexto completo del proyecto para generar código consistente

---

## 🎯 Objetivo del Proyecto

Desarrollar una **aplicación móvil Android MVP** para censadores en campo que permita:
- ✅ Crear y editar censos offline
- ✅ Sincronizar automáticamente con servidor Laravel cuando haya conexión
- ✅ Capturar geolocalización GPS
- ✅ Autenticación segura con tokens
- ✅ Interfaz simple y funcional

---

## 🏗️ Arquitectura del Sistema

### Backend (Laravel - Ya existente)
- **Framework**: Laravel 10+
- **Base de datos**: MySQL
- **Autenticación**: Laravel Sanctum (tokens API)
- **URL Base API**: `http://10.0.2.2:8000/api` (emulador) / `http://localhost:8000/api` (físico)

### Frontend Android (A desarrollar)
- **Lenguaje**: Kotlin
- **UI Framework**: Jetpack Compose + Material Design 3
- **Arquitectura**: MVVM (Model-View-ViewModel)
- **Min SDK**: API 21 (Android 5.0)
- **Target SDK**: API 34+ (Android 14)

---

## 📦 Estructura de Carpetas MVVM

```
app/src/main/java/com/tecperote/aquatenex/
│
├── data/                           # Capa de datos
│   ├── local/                      # Base de datos local (Room)
│   │   ├── dao/
│   │   │   └── CensoDao.kt
│   │   ├── entity/
│   │   │   └── CensoEntity.kt
│   │   └── AppDatabase.kt
│   │
│   ├── remote/                     # API REST (Retrofit)
│   │   ├── dto/                    # Data Transfer Objects
│   │   │   ├── LoginRequest.kt
│   │   │   ├── LoginResponse.kt
│   │   │   ├── CensoDto.kt
│   │   │   └── ApiResponse.kt
│   │   ├── api/
│   │   │   ├── AuthApiService.kt
│   │   │   └── CensoApiService.kt
│   │   └── RetrofitClient.kt
│   │
│   └── repository/                 # Repositorios (única fuente de verdad)
│       ├── AuthRepository.kt
│       └── CensoRepository.kt
│
├── domain/                         # Capa de dominio (lógica de negocio)
│   ├── model/                      # Modelos de negocio (POKOs)
│   │   ├── Censo.kt
│   │   └── Usuario.kt
│   └── usecase/                    # Casos de uso (opcional para MVP)
│
├── presentation/                   # Capa de presentación (UI)
│   ├── login/
│   │   ├── LoginScreen.kt
│   │   ├── LoginViewModel.kt
│   │   └── LoginState.kt
│   │
│   ├── censos/
│   │   ├── list/
│   │   │   ├── CensosListScreen.kt
│   │   │   ├── CensosViewModel.kt
│   │   │   └── CensosState.kt
│   │   └── form/
│   │       ├── CensoFormScreen.kt
│   │       ├── CensoFormViewModel.kt
│   │       └── CensoFormState.kt
│   │
│   ├── components/                 # Componentes reutilizables
│   │   ├── LoadingScreen.kt
│   │   ├── ErrorScreen.kt
│   │   ├── CustomTextField.kt
│   │   └── SyncIndicator.kt
│   │
│   └── navigation/
│       ├── NavGraph.kt
│       └── Screen.kt               # Sealed class con rutas
│
├── utils/                          # Utilidades
│   ├── Constants.kt
│   ├── Extensions.kt
│   ├── NetworkUtils.kt
│   └── LocationHelper.kt
│
└── worker/                         # Background tasks (WorkManager)
    └── SincronizacionWorker.kt
```

---

## 🔌 Endpoints API Laravel (Backend)

### Base URL
```
http://10.0.2.2:8000/api  (para emulador Android)
http://localhost:8000/api (para dispositivo físico en misma red)
```

### Autenticación

#### Login
```http
POST /api/login
Content-Type: application/json

Request Body:
{
  "email": "censador@example.com",
  "password": "password123"
}

Response 200:
{
  "success": true,
  "token": "1|abcdef123456...",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "censador@example.com",
    "role": "censador"
  }
}

Response 401:
{
  "success": false,
  "message": "Credenciales incorrectas"
}
```

#### Logout
```http
POST /api/logout
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

### Censos

#### Listar Censos (del usuario autenticado)
```http
GET /api/censos
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre_completo": "María García",
      "direccion": "Calle Principal 123",
      "telefono": "555-1234",
      "latitud": "-12.0464",
      "longitud": "-77.0428",
      "fecha_censo": "2025-11-08T10:30:00Z",
      "observaciones": "Casa de dos pisos",
      "censador_id": 1,
      "sincronizado": true,
      "created_at": "2025-11-08T10:35:00Z",
      "updated_at": "2025-11-08T10:35:00Z"
    }
  ]
}
```

#### Crear Censo
```http
POST /api/censos
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "nombre_completo": "Pedro Sánchez",
  "direccion": "Av. Los Héroes 456",
  "telefono": "555-5678",
  "latitud": "-12.0500",
  "longitud": "-77.0500",
  "fecha_censo": "2025-11-08T14:00:00Z",
  "observaciones": "Departamento 3A"
}

Response 201:
{
  "success": true,
  "data": {
    "id": 2,
    "nombre_completo": "Pedro Sánchez",
    // ... resto de campos
  },
  "message": "Censo creado exitosamente"
}

Response 422: (Validación fallida)
{
  "success": false,
  "errors": {
    "nombre_completo": ["El campo nombre completo es requerido"],
    "direccion": ["El campo dirección es requerido"]
  }
}
```

#### Actualizar Censo
```http
PUT /api/censos/{id}
Authorization: Bearer {token}
Content-Type: application/json

Request Body: (igual que POST)

Response 200:
{
  "success": true,
  "data": { /* censo actualizado */ },
  "message": "Censo actualizado exitosamente"
}
```

#### Eliminar Censo
```http
DELETE /api/censos/{id}
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "Censo eliminado exitosamente"
}
```

---

## 📊 Modelo de Datos

### Censo (Modelo de Negocio - Kotlin)
```kotlin
data class Censo(
    val id: Int = 0,
    val nombreCompleto: String,
    val direccion: String,
    val telefono: String?,
    val latitud: Double,
    val longitud: Double,
    val fechaCenso: String, // ISO 8601 format
    val observaciones: String?,
    val censadorId: Int,
    val sincronizado: Boolean = false,
    val createdAt: String?,
    val updatedAt: String?
)
```

### CensoEntity (Room Database - Kotlin)
```kotlin
@Entity(tableName = "censos")
data class CensoEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,
    
    @ColumnInfo(name = "nombre_completo")
    val nombreCompleto: String,
    
    @ColumnInfo(name = "direccion")
    val direccion: String,
    
    @ColumnInfo(name = "telefono")
    val telefono: String?,
    
    @ColumnInfo(name = "latitud")
    val latitud: Double,
    
    @ColumnInfo(name = "longitud")
    val longitud: Double,
    
    @ColumnInfo(name = "fecha_censo")
    val fechaCenso: String,
    
    @ColumnInfo(name = "observaciones")
    val observaciones: String?,
    
    @ColumnInfo(name = "censador_id")
    val censadorId: Int,
    
    @ColumnInfo(name = "sincronizado")
    val sincronizado: Boolean = false,
    
    @ColumnInfo(name = "created_at")
    val createdAt: String?,
    
    @ColumnInfo(name = "updated_at")
    val updatedAt: String?
)
```

### Usuario
```kotlin
data class Usuario(
    val id: Int,
    val name: String,
    val email: String,
    val role: String
)
```

---

## 🎨 Estados UI (State Pattern)

### LoginState
```kotlin
sealed class LoginState {
    object Idle : LoginState()
    object Loading : LoginState()
    data class Success(val user: Usuario) : LoginState()
    data class Error(val message: String) : LoginState()
}
```

### CensosListState
```kotlin
data class CensosListState(
    val censos: List<Censo> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val pendiendeSincronizar: Int = 0
)
```

### CensoFormState
```kotlin
data class CensoFormState(
    val nombreCompleto: String = "",
    val direccion: String = "",
    val telefono: String = "",
    val latitud: Double = 0.0,
    val longitud: Double = 0.0,
    val observaciones: String = "",
    val isLoading: Boolean = false,
    val isSaved: Boolean = false,
    val error: String? = null,
    val validationErrors: Map<String, String> = emptyMap()
)
```

---

## 🔐 Manejo de Autenticación

### Almacenamiento de Token (DataStore)
```kotlin
// TokenManager.kt
class TokenManager(private val context: Context) {
    private val dataStore = context.dataStore
    
    companion object {
        private val TOKEN_KEY = stringPreferencesKey("auth_token")
        private val USER_ID_KEY = intPreferencesKey("user_id")
    }
    
    suspend fun saveToken(token: String, userId: Int) {
        dataStore.edit { preferences ->
            preferences[TOKEN_KEY] = token
            preferences[USER_ID_KEY] = userId
        }
    }
    
    fun getToken(): Flow<String?> = dataStore.data
        .map { preferences -> preferences[TOKEN_KEY] }
    
    suspend fun clearToken() {
        dataStore.edit { it.clear() }
    }
}
```

### Interceptor de Retrofit
```kotlin
class AuthInterceptor(private val tokenManager: TokenManager) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val token = runBlocking { tokenManager.getToken().first() }
        
        val request = if (token != null) {
            chain.request().newBuilder()
                .addHeader("Authorization", "Bearer $token")
                .addHeader("Accept", "application/json")
                .build()
        } else {
            chain.request()
        }
        
        return chain.proceed(request)
    }
}
```

---

## 📍 Geolocalización GPS

### Permisos en AndroidManifest.xml
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

### LocationHelper (Ejemplo básico)
```kotlin
class LocationHelper(private val context: Context) {
    private val fusedLocationClient = LocationServices.getFusedLocationProviderClient(context)
    
    @SuppressLint("MissingPermission")
    suspend fun getCurrentLocation(): Location? = suspendCoroutine { continuation ->
        fusedLocationClient.lastLocation
            .addOnSuccessListener { location ->
                continuation.resume(location)
            }
            .addOnFailureListener {
                continuation.resume(null)
            }
    }
}
```

---

## 🔄 Sincronización con WorkManager

### Worker para Sincronización
```kotlin
class SincronizacionWorker(
    context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {
    
    override suspend fun doWork(): Result {
        return try {
            // 1. Obtener censos no sincronizados de Room
            // 2. Enviarlos a la API
            // 3. Marcar como sincronizados en Room
            Result.success()
        } catch (e: Exception) {
            Result.retry()
        }
    }
}
```

### Programación periódica
```kotlin
val constraints = Constraints.Builder()
    .setRequiredNetworkType(NetworkType.CONNECTED)
    .build()

val syncRequest = PeriodicWorkRequestBuilder<SincronizacionWorker>(
    repeatInterval = 15,
    repeatIntervalTimeUnit = TimeUnit.MINUTES
)
    .setConstraints(constraints)
    .build()

WorkManager.getInstance(context).enqueueUniquePeriodicWork(
    "censo_sync",
    ExistingPeriodicWorkPolicy.KEEP,
    syncRequest
)
```

---

## 🎨 Convenciones de Código

### Nombres de Archivos
- **Screens**: `NombreScreen.kt` (ej: `LoginScreen.kt`)
- **ViewModels**: `NombreViewModel.kt` (ej: `CensosViewModel.kt`)
- **States**: `NombreState.kt`
- **Entities**: `NombreEntity.kt`
- **DTOs**: `NombreDto.kt` o `NombreRequest.kt` / `NombreResponse.kt`

### Nomenclatura Kotlin
- **Variables**: camelCase (`nombreCompleto`)
- **Constantes**: UPPER_SNAKE_CASE (`BASE_URL`)
- **Clases**: PascalCase (`CensoRepository`)
- **Funciones**: camelCase (`getCensos()`)

### Composables
```kotlin
@Composable
fun NombreComponente(
    modifier: Modifier = Modifier,
    parametro1: String,
    onAction: () -> Unit
) {
    // Implementación
}
```

---

## 🛠️ Dependencias del Proyecto

### build.gradle.kts (Module :app)
```kotlin
dependencies {
    // Core Android
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.activity:activity-compose:1.8.2")
    
    // Compose
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    
    // Navigation
    implementation("androidx.navigation:navigation-compose:2.7.6")
    
    // Retrofit
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
    
    // Room
    val room_version = "2.6.1"
    implementation("androidx.room:room-runtime:$room_version")
    implementation("androidx.room:room-ktx:$room_version")
    ksp("androidx.room:room-compiler:$room_version")
    
    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
    
    // ViewModel
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.7.0")
    
    // DataStore
    implementation("androidx.datastore:datastore-preferences:1.0.0")
    
    // WorkManager
    implementation("androidx.work:work-runtime-ktx:2.9.0")
    
    // Location Services
    implementation("com.google.android.gms:play-services-location:21.0.1")
    
    // Testing (opcional para MVP)
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
}
```

---

## 🔒 Validaciones del Formulario

### Reglas de Validación
- **Nombre Completo**: Requerido, mínimo 3 caracteres
- **Dirección**: Requerido, mínimo 5 caracteres
- **Teléfono**: Opcional, pero si se ingresa debe tener formato válido (regex)
- **Latitud/Longitud**: Requerido, deben ser números válidos
- **Fecha Censo**: Requerido, formato ISO 8601
- **Observaciones**: Opcional, máximo 500 caracteres

### Ejemplo de Validación en ViewModel
```kotlin
fun validateForm(state: CensoFormState): Map<String, String> {
    val errors = mutableMapOf<String, String>()
    
    if (state.nombreCompleto.isBlank()) {
        errors["nombreCompleto"] = "El nombre completo es requerido"
    } else if (state.nombreCompleto.length < 3) {
        errors["nombreCompleto"] = "Mínimo 3 caracteres"
    }
    
    if (state.direccion.isBlank()) {
        errors["direccion"] = "La dirección es requerida"
    }
    
    if (state.latitud == 0.0 || state.longitud == 0.0) {
        errors["location"] = "Debe capturar la ubicación GPS"
    }
    
    return errors
}
```

---

## 🎯 Criterios de Éxito (Acceptance Criteria)

### MVP Funcional debe cumplir:
1. ✅ Usuario puede iniciar sesión con credenciales válidas
2. ✅ Lista de censos se carga desde API y se muestra en pantalla
3. ✅ Usuario puede crear un nuevo censo con todos los campos requeridos
4. ✅ Geolocalización GPS se captura automáticamente
5. ✅ Censos se guardan localmente en Room si no hay conexión
6. ✅ Censos offline se sincronizan automáticamente cuando hay conexión
7. ✅ Indicador visual muestra censos pendientes de sincronizar
8. ✅ Usuario puede cerrar sesión y el token se elimina
9. ✅ App funciona completamente sin conexión a internet
10. ✅ UI es clara, simple y sigue Material Design 3

---

## 📝 Notas Importantes para IA

### Al generar código, considera:
1. **Usar Coroutines y Flow** para operaciones asíncronas
2. **Manejo de errores**: Try-catch en repositories, estados de error en UI
3. **Offline First**: Siempre leer desde Room primero, luego actualizar desde API
4. **Null Safety**: Usar `?` y `?:` apropiadamente en Kotlin
5. **Composables pequeños**: Dividir UI en componentes reutilizables
6. **Estados inmutables**: Usar `data class` con `val` en states
7. **Loading states**: Siempre mostrar feedback al usuario
8. **Material Design 3**: Usar componentes de `androidx.compose.material3`

### Patrones a seguir:
- **Repository Pattern**: Única fuente de verdad para datos
- **Single Source of Truth**: Room es la fuente principal, API es backup
- **Unidirectional Data Flow**: ViewModel → State → UI → Events → ViewModel
- **Separation of Concerns**: Capas data/domain/presentation bien definidas

---

## 🚀 Comandos Útiles

### Verificar dependencias
```bash
./gradlew dependencies
```

### Limpiar build
```bash
./gradlew clean
```

### Generar APK debug
```bash
./gradlew assembleDebug
```

---

**Fecha de creación**: 8 de Noviembre 2025  
**Última actualización**: 8 de Noviembre 2025  
**Versión**: 1.0  
**Proyecto**: AquaTenex - App Android Censadores MVP
