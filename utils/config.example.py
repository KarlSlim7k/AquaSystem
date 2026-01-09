# ============================================================
# AQUATENEX - ARCHIVO DE CONFIGURACIÓN
# ============================================================
# INSTRUCCIONES:
# 1. Copia este archivo como: config.py
# 2. Edita los valores según tu configuración
# 3. NO compartas este archivo (contiene credenciales)
# ============================================================

# Configuración de la base de datos MySQL
DB_CONFIG = {
    'host': 'localhost',        # Host del servidor MySQL
    'port': 3306,               # Puerto (por defecto: 3306)
    'database': 'aquatenex_db', # Nombre de la base de datos
    'user': 'root',             # Usuario MySQL
    'password': '',             # Contraseña MySQL (¡MANTENER SEGURA!)
    'charset': 'utf8mb4',
    'collation': 'utf8mb4_unicode_ci',
    'autocommit': False
}

# Configuración de seguridad de bcrypt
BCRYPT_ROUNDS = 12  # Número de rondas (10-14 recomendado)
                    # Más rondas = más seguro pero más lento
                    # 12 rondas ≈ 0.3 segundos por hash

# Configuración de contraseñas
PASSWORD_MIN_LENGTH = 8         # Longitud mínima de contraseña
PASSWORD_REQUIRE_UPPER = True   # Requerir mayúsculas
PASSWORD_REQUIRE_LOWER = True   # Requerir minúsculas
PASSWORD_REQUIRE_DIGIT = True   # Requerir números
PASSWORD_REQUIRE_SPECIAL = False # Requerir caracteres especiales

# Configuración de sesión
MAX_LOGIN_ATTEMPTS = 3      # Intentos máximos antes de bloqueo
LOCKOUT_DURATION = 30       # Minutos de bloqueo
SESSION_TIMEOUT = 60        # Minutos antes de cerrar sesión

# Configuración de auditoría
ENABLE_AUDIT_LOG = True     # Habilitar registro de auditoría
LOG_FAILED_LOGINS = True    # Registrar intentos fallidos
LOG_PASSWORD_CHANGES = True # Registrar cambios de contraseña

# Configuración de notificaciones
NOTIFY_PASSWORD_CHANGE = True   # Notificar cambios de contraseña
NOTIFY_NEW_USER = True          # Notificar creación de usuarios
NOTIFY_FAILED_LOGINS = True     # Notificar intentos fallidos

# ============================================================
# NOTAS DE SEGURIDAD:
# ============================================================
# - NUNCA subas este archivo a repositorios públicos
# - Cambia la contraseña de la base de datos periódicamente
# - Usa contraseñas fuertes para usuarios del sistema
# - Mantén Python y las librerías actualizadas
# - Realiza respaldos periódicos de la base de datos
# ============================================================
