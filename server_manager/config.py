# Configuración del Server Manager (OPCIONAL)
# Si este archivo existe, se usarán estos valores. Si no, se usarán los valores por defecto.

# Rutas personalizadas (si tu proyecto está en otra ubicación)
# Dejar vacío o comentar para usar la detección automática
BACKEND_PATH = ""
FRONTEND_PATH = ""

# Puertos personalizados
# Laravel normalmente usa 8000
BACKEND_PORT = 8000
# Vite normalmente usa 5173
FRONTEND_PORT = 5173

# Comandos personalizados para iniciar los servidores
# Útil si necesitas parámetros especiales
BACKEND_COMMAND = "php artisan serve"
FRONTEND_COMMAND = "npm run dev"

# Tiempo de espera para verificar que los servidores iniciaron (en segundos)
BACKEND_STARTUP_WAIT = 2
FRONTEND_STARTUP_WAIT = 3

# Mostrar logs detallados de los servidores
SHOW_SERVER_LOGS = True

# Tiempo de espera al detener servidores (en segundos)
SHUTDOWN_TIMEOUT = 5
