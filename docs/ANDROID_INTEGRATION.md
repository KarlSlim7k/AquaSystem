# Integración Android ↔ Backend (AquaTenex)

Este documento sirve como guía práctica para configurar la app Android Studio de manera que se conecte de forma segura y sincronizada con el backend Laravel y la base de datos del proyecto (AquaTenex). Incluye recomendaciones, pasos de verificación, patrones de diseño para la comunicación, seguridad y sincronización de datos entre la app móvil y el sistema web.

> Nota: esta guía cubre tanto desarrollo (Dev Tunnels / ngrok) como recomendaciones para producción (dominio con TLS). No se recomienda exponer MySQL directamente a la app móvil en producción.

---

## 1. Arquitectura recomendada (resumen)

- La aplicación Android siempre debe comunicarse con el backend (Laravel) vía API HTTPS.
- El backend es el único que accede a MySQL; la app nunca se conecta directamente a la base de datos en producción.
- En desarrollo puedes usar DevTunnels / ngrok para exponer temporalmente el backend al dispositivo físico.

Arquitectura simplificada:

- Android App (Retrofit/OkHttp)
  - HTTPS → Backend Laravel (Apache/Nginx) → MySQL
- Frontend Web usa la misma API (misma base URL o subdominio)

---

## 2. Base URL y entornos

- Desarrollo (ejemplo usando DevTunnels):
  - Frontend: `https://<tunnel>-5173.usw3.devtunnels.ms`
  - Backend API: `https://<tunnel>-443.usw3.devtunnels.ms` (usa la URL que te provea VS Code PORTS)

- Producción:
  - Usa un dominio propio (por ejemplo `api.aquatenex.com`) con certificado TLS (Let's Encrypt).

Configurar en Android Studio: usar una constante de configuración (BuildConfig o resource) para la BASE_URL y cambiarla por flavor/env.

---

## 3. Autenticación y seguridad

- Mecanismo recomendado: tokens Bearer (JWT o Personal Access Tokens).
  - Endpoint de login: `POST /api/login` → devuelve: { success, data: { token, usuario } }
  - El cliente debe enviar `Authorization: Bearer <token>` en las peticiones protegidas.

  Nota para demo con DevTunnels: durante la preparación del demo (DevTunnels) se adoptó una compatibilidad práctica en el frontend — el endpoint de login se consume enviando los credenciales como "application/x-www-form-urlencoded" en lugar de JSON. Esto se implementó para evitar problemas de parsing a través del proxy/tunnel en entornos locales. Para integradores Android:

  - En la app móvil pueden usar form-encoding para el login durante la fase de demo (por ejemplo enviar `username=...&password=...` con header `Content-Type: application/x-www-form-urlencoded`).
  - A mediano plazo, para producción preferir enviar JSON (Content-Type: application/json). Si quieres, puedo ayudar a ajustar backend/frontend para aceptar ambos formatos de manera consistente.

- Almacenamiento del token en Android:
  - En producción usa `EncryptedSharedPreferences` o Android Keystore.
  - No almacenes tokens en texto plano ni en `SharedPreferences` sin cifrado.

- HTTPS obligatorio: todas las peticiones desde Android deben usar HTTPS.
- Considerar: refresh tokens o tokens con expiración y endpoint para refresh.
- Opcional (producción): certificate pinning con OkHttp para mayor seguridad.

---

## 4. Bibliotecas recomendadas (Android)

- Retrofit + OkHttp
- Moshi o Gson (para JSON)
- Kotlin Coroutines (o RxJava) para llamadas asíncronas
- WorkManager para sincronizaciones periódicas en background
- Room para cache local/sin conexión
- Jetpack Security (EncryptedSharedPreferences) para guardar token

---

## 5. Endpoints y contratos (ejemplos)

Asegúrate que los endpoints del backend siguen estos contratos:

- POST /api/login
  - Request: { username, password }
  - Response: { success: true, message: 'Login exitoso', data: { token: "...", usuario: { id, username, nombre_completo, rol, ... } } }

- POST /api/logout (auth)
  - Header: Authorization: Bearer <token>

- GET /api/me (auth)
  - Header: Authorization: Bearer <token>
  - Response: { success: true, data: { ...usuario } }

- Otros recursos: `/api/usuarios-agua`, `/api/pagos`, etc. Deben soportar paginación y filtros.

---

## 6. Manejo del token en el cliente

- Tras login, guarda el token de forma segura.
- Interceptor de OkHttp: añade `Authorization: Bearer <token>` a cada petición si existe.
- Si recibes 401: redirigir a login o intentar refresh (si implementado).

---

## 7. Retrofit / OkHttp (configuración conceptual)

- Base URL: la URL HTTPS del backend (tunnel o dominio).
- Timeouts: configurar timeouts razonables (connect/read/write).
- Interceptor para logs en desarrollo; deshabilitar en producción.
- Interceptor para añadir Authorization header.

Ejemplo conceptual de header que debe enviarse en cada request:

```
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
```

---

## 8. Pruebas en emulador y dispositivo físico

- Emulador Android (AVD): para acceder al host local usa `http://10.0.2.2:8000` (solo si Laravel sirve en host local sin tunnel). Si usas DevTunnels/ngrok, usa la URL pública del tunnel.
- Dispositivo físico: usar la URL del tunnel o la IP pública del servidor (si está protegido y con TLS).
- Prueba inicial con `curl` o Postman desde una máquina externa para confirmar el endpoint.

Ejemplo `curl` para testear login (reemplaza URL):

```bash
curl -X POST "https://<TU_TUNNEL>-443.usw3.devtunnels.ms/api/login" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 9. Sincronización y manejo offline

- Estrategia recomendada:
  - Cache local con Room para lectura offline.
  - Operaciones mutating (crear/editar) encoladas localmente y sincronizadas con WorkManager cuando haya conexión.
  - Conflictos: implementar resolución basada en timestamps o versionado (p. ej. `updated_at` + servidor gana o merge manual en UI).

- Sincronización en segundo plano:
  - WorkManager para tareas periódicas y bajo condiciones de red (unmetered/battery ok opcional).

- Push notifications (FCM) para notificar cambios del backend y forzar sync inmediato.

---

## 10. Consideraciones sobre MySQL remoto

- No exponer MySQL al público si no es necesario.
- Si necesitas acceso remoto puntual para pruebas:
  - `bind-address = 0.0.0.0` en `my.cnf` (solo en entornos controlados).
  - Crear usuario MySQL con `host` restringido o `%` para pruebas, sin permisos excesivos.
  - Abrir puerto 3306 sólo en firewall para IPs específicas.
  - Habilitar TLS en MySQL para conexiones encriptadas si se conecta remotamente.

Recomendación final: evita que la app móvil se conecte a la DB directamente.

---

## 11. Logs y debugging

- En backend, revisa `storage/logs/laravel.log` y logs de Apache para errores (CORS, 401, 500).
- En Android, habilita logging en OkHttp para ver request/response en desarrollo.
- Para problemas de CORS, revisa cabeceras `Access-Control-Allow-Origin` y `Access-Control-Allow-Credentials`.

---

## 12. Checklist rápida antes de pruebas desde Android

- [ ] Backend accesible por HTTPS (tunnel o dominio)
- [ ] Endpoint `/api/login` responde y devuelve token
- [ ] CORS configurado para el origen del frontend (y para pruebas móviles si es necesario)
- [ ] Frontend y Android usan la misma base URL del backend
- [ ] Token guardado con `EncryptedSharedPreferences`
- [ ] OkHttp interceptor añade `Authorization` correctamente
- [ ] Pruebas en emulador (`10.0.2.2`) o dispositivo físico con tunnel

---

## 13. Siguientes pasos sugeridos (práctico)

1. Configura la `BASE_URL` en Android Studio con la URL del tunnel que usas para el frontend/backend.
2. Implementa Retrofit + OkHttp con interceptor de `Authorization`.
3. Prueba login con Postman y luego desde la app.
4. Implementa cache local (Room) y sincronización básica con WorkManager.

---

Si quieres, puedo generar una versión más condensada para copiar en Android Studio (por ejemplo una `NOTAS_INTEGRACION.md` dentro del proyecto Android) o guiarte paso a paso en Android Studio para configurar Retrofit y el almacenamiento seguro de tokens. ¿Qué prefieres? 

---

## 14. Ejemplos prácticos de Android (snippets listos para pegar)

Los siguientes snippets son recomendados para que Copilot/Android Studio los pegue directamente en el proyecto Android. Cubren: dependencia Gradle mínima, interfaz Retrofit para login (form-encoded usado en la demo), modelo de respuesta, interceptor OkHttp para añadir Authorization y ejemplo de almacenamiento seguro con EncryptedSharedPreferences.

1) Dependencias (app/build.gradle):

```gradle
dependencies {
  implementation 'com.squareup.retrofit2:retrofit:2.9.0'
  implementation 'com.squareup.retrofit2:converter-moshi:2.9.0' // o converter-gson
  implementation 'com.squareup.okhttp3:okhttp:4.11.0'
  implementation 'com.squareup.okhttp3:logging-interceptor:4.11.0'
  implementation 'androidx.security:security-crypto:1.1.0-alpha03'
  implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.6.4'
}
```

2) Interfaz Retrofit (form-encoded login — adecuada para demo con DevTunnels):

```kotlin
interface AuthApi {
  @FormUrlEncoded
  @POST("api/login")
  suspend fun login(
    @Field("username") username: String,
    @Field("password") password: String
  ): Response<LoginResponse>
}
```

3) Modelo de respuesta (Kotlin data classes — ajusta campos según respuesta real):

```kotlin
data class LoginResponse(
  val success: Boolean,
  val message: String?,
  val data: LoginData?
)

data class LoginData(
  val token: String,
  val usuario: Usuario
)

data class Usuario(
  val id: Int,
  val username: String,
  val nombre_completo: String?,
  val email: String?,
  val rol: String?
)
```

4) OkHttp interceptor para inyectar el token (Singleton):

```kotlin
class AuthInterceptor(private val tokenProvider: () -> String?) : Interceptor {
  override fun intercept(chain: Interceptor.Chain): Response {
    val reqBuilder = chain.request().newBuilder()
    tokenProvider()?.let { token ->
      reqBuilder.addHeader("Authorization", "Bearer $token")
    }
    return chain.proceed(reqBuilder.build())
  }
}
```

5) Crear Retrofit con OkHttp y logging (ejemplo de builder):

```kotlin
fun provideRetrofit(baseUrl: String, tokenProvider: () -> String?): Retrofit {
  val logging = HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BODY }
  val client = OkHttpClient.Builder()
    .addInterceptor(AuthInterceptor(tokenProvider))
    .addInterceptor(logging)
    .build()

  return Retrofit.Builder()
    .baseUrl(baseUrl)
    .client(client)
    .addConverterFactory(MoshiConverterFactory.create())
    .build()
}
```

6) Guardar token con EncryptedSharedPreferences (ejemplo mínimo):

```kotlin
fun provideEncryptedPrefs(context: Context): SharedPreferences {
  val masterKey = MasterKey.Builder(context)
    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
    .build()

  return EncryptedSharedPreferences.create(
    context,
    "secure_prefs",
    masterKey,
    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
  )
}

// Uso: prefs.edit().putString("auth_token", token).apply()
```

7) Ejemplo rápido de uso (coroutine) — login y almacenar token:

```kotlin
suspend fun doLogin(authApi: AuthApi, prefs: SharedPreferences, username: String, password: String): Boolean {
  val resp = authApi.login(username, password)
  if (resp.isSuccessful) {
    val body = resp.body()
    val token = body?.data?.token
    if (!token.isNullOrEmpty()) {
      prefs.edit().putString("auth_token", token).apply()
      return true
    }
  }
  return false
}
```

8) Nota sobre formatos y compatibilidad

- Para la demo (DevTunnels) usamos form-encoding en `/api/login` porque el proxy/tunnel del entorno actual mostró un comportamiento más fiable con `application/x-www-form-urlencoded`.
- En producción lo habitual es enviar JSON (Content-Type: application/json). Si deseas mantener compatibilidad, el backend puede adaptarse para aceptar ambos (ej. leer `json_decode` y fallback a `request->input()`). Puedo aportar el cambio en el controlador backend si lo quieres.

9) Pruebas locales y en emulador

- Emulador AVD (cuando Laravel corre local sin tunnel): usa `http://10.0.2.2:80` o la URL que corresponda.
- Dispositivo físico: usa la URL pública del DevTunnel (`https://<tunnel>-443.usw3.devtunnels.ms`).
- Curl para probar form-encoded (ejemplo):

```bash
curl -X POST "https://<TU_TUNNEL>-443.usw3.devtunnels.ms/api/login" \
  -H "Accept: application/json" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin123"
```

---

Si quieres que añada estos snippets también en un archivo separado `docs/NOTAS_INTEGRACION_ANDROID.md` listo para pegar en el repo Android, lo creo ahora mismo. ¿Deseas que lo agregue aquí o que lo genere por separado? 
