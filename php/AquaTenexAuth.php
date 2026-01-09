<?php
/**
 * ============================================================
 * AQUATENEX - CLASE DE AUTENTICACIÓN CON BCRYPT
 * ============================================================
 * Clase PHP para verificar contraseñas bcrypt generadas
 * por el gestor de contraseñas de Python
 * ============================================================
 */

class AquaTenexAuth {
    
    private $pdo;
    
    /**
     * Constructor - Establece conexión con la base de datos
     */
    public function __construct($host = 'localhost', $dbname = 'aquatenex_db', $user = 'root', $pass = '') {
        try {
            $this->pdo = new PDO(
                "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
                $user,
                $pass,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );
        } catch (PDOException $e) {
            die("Error de conexión: " . $e->getMessage());
        }
    }
    
    /**
     * Verificar credenciales de usuario
     * 
     * @param string $username Nombre de usuario
     * @param string $password Contraseña en texto plano
     * @return array|false Datos del usuario si es válido, false si no
     */
    public function verificarCredenciales($username, $password) {
        // Obtener usuario de la base de datos
        $stmt = $this->pdo->prepare("
            SELECT 
                id_usuario_sistema,
                username,
                password_hash,
                nombre_completo,
                email,
                rol,
                activo,
                bloqueado,
                intentos_fallidos
            FROM usuarios_sistema
            WHERE username = ?
        ");
        
        $stmt->execute([$username]);
        $usuario = $stmt->fetch();
        
        // Usuario no existe
        if (!$usuario) {
            $this->registrarBitacora(null, 'login_fallido', 'Usuario no encontrado: ' . $username);
            return false;
        }
        
        // Usuario inactivo
        if (!$usuario['activo']) {
            $this->registrarBitacora($usuario['id_usuario_sistema'], 'login_fallido', 'Usuario inactivo');
            return false;
        }
        
        // Usuario bloqueado
        if ($usuario['bloqueado']) {
            $this->registrarBitacora($usuario['id_usuario_sistema'], 'login_fallido', 'Usuario bloqueado');
            return false;
        }
        
        // Verificar contraseña usando password_verify (compatible con bcrypt)
        if (password_verify($password, $usuario['password_hash'])) {
            // Contraseña correcta
            $this->resetearIntentosLogin($usuario['id_usuario_sistema']);
            $this->actualizarUltimoAcceso($usuario['id_usuario_sistema']);
            $this->registrarBitacora($usuario['id_usuario_sistema'], 'login_exitoso', 'Login correcto');
            
            // Retornar datos del usuario (sin el hash de contraseña)
            unset($usuario['password_hash']);
            unset($usuario['intentos_fallidos']);
            
            return $usuario;
        } else {
            // Contraseña incorrecta
            $this->incrementarIntentosLogin($usuario['id_usuario_sistema']);
            $this->registrarBitacora($usuario['id_usuario_sistema'], 'login_fallido', 'Contraseña incorrecta');
            return false;
        }
    }
    
    /**
     * Verificar si una contraseña es válida (sin consultar BD)
     * Útil para cambio de contraseñas
     */
    public function verificarFortalezaPassword($password) {
        $errores = [];
        
        // Longitud mínima
        if (strlen($password) < 8) {
            $errores[] = "La contraseña debe tener al menos 8 caracteres";
        }
        
        // Al menos una mayúscula
        if (!preg_match('/[A-Z]/', $password)) {
            $errores[] = "La contraseña debe contener al menos una mayúscula";
        }
        
        // Al menos una minúscula
        if (!preg_match('/[a-z]/', $password)) {
            $errores[] = "La contraseña debe contener al menos una minúscula";
        }
        
        // Al menos un número
        if (!preg_match('/[0-9]/', $password)) {
            $errores[] = "La contraseña debe contener al menos un número";
        }
        
        return empty($errores) ? true : $errores;
    }
    
    /**
     * Incrementar contador de intentos fallidos
     */
    private function incrementarIntentosLogin($id_usuario) {
        $stmt = $this->pdo->prepare("
            UPDATE usuarios_sistema
            SET intentos_fallidos = intentos_fallidos + 1,
                bloqueado = CASE 
                    WHEN intentos_fallidos >= 2 THEN TRUE 
                    ELSE bloqueado 
                END
            WHERE id_usuario_sistema = ?
        ");
        $stmt->execute([$id_usuario]);
    }
    
    /**
     * Resetear contador de intentos fallidos
     */
    private function resetearIntentosLogin($id_usuario) {
        $stmt = $this->pdo->prepare("
            UPDATE usuarios_sistema
            SET intentos_fallidos = 0,
                bloqueado = FALSE
            WHERE id_usuario_sistema = ?
        ");
        $stmt->execute([$id_usuario]);
    }
    
    /**
     * Actualizar último acceso
     */
    private function actualizarUltimoAcceso($id_usuario) {
        $stmt = $this->pdo->prepare("
            UPDATE usuarios_sistema
            SET ultimo_acceso = NOW()
            WHERE id_usuario_sistema = ?
        ");
        $stmt->execute([$id_usuario]);
    }
    
    /**
     * Registrar en bitácora del sistema
     */
    private function registrarBitacora($id_usuario, $accion, $descripcion) {
        try {
            $stmt = $this->pdo->prepare("
                INSERT INTO bitacora_sistema 
                (id_usuario_sistema, accion, modulo, descripcion, ip_address, user_agent)
                VALUES (?, ?, 'autenticacion', ?, ?, ?)
            ");
            
            $ip = $_SERVER['REMOTE_ADDR'] ?? 'N/A';
            $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'N/A';
            
            $stmt->execute([
                $id_usuario,
                $accion,
                $descripcion,
                $ip,
                substr($user_agent, 0, 255)
            ]);
        } catch (Exception $e) {
            // Error en bitácora no debe detener el flujo
            error_log("Error en bitácora: " . $e->getMessage());
        }
    }
    
    /**
     * Cerrar sesión
     */
    public function cerrarSesion($id_usuario) {
        $this->registrarBitacora($id_usuario, 'logout', 'Sesión cerrada');
        session_destroy();
    }
    
    /**
     * Verificar si el usuario tiene un rol específico
     */
    public function tieneRol($usuario, $rol_requerido) {
        if (is_array($rol_requerido)) {
            return in_array($usuario['rol'], $rol_requerido);
        }
        return $usuario['rol'] === $rol_requerido;
    }
    
    /**
     * Obtener información del usuario por ID
     */
    public function obtenerUsuario($id_usuario) {
        $stmt = $this->pdo->prepare("
            SELECT 
                id_usuario_sistema,
                username,
                nombre_completo,
                email,
                telefono,
                rol,
                activo,
                ultimo_acceso
            FROM usuarios_sistema
            WHERE id_usuario_sistema = ? AND activo = TRUE
        ");
        
        $stmt->execute([$id_usuario]);
        return $stmt->fetch();
    }
}

/**
 * ============================================================
 * EJEMPLO DE USO
 * ============================================================
 */

/*
// Iniciar sesión
session_start();

// Crear instancia de autenticación
$auth = new AquaTenexAuth('localhost', 'aquatenex_db', 'root', '');

// Procesar login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    $usuario = $auth->verificarCredenciales($username, $password);
    
    if ($usuario) {
        // Login exitoso
        $_SESSION['usuario_id'] = $usuario['id_usuario_sistema'];
        $_SESSION['usuario_nombre'] = $usuario['nombre_completo'];
        $_SESSION['usuario_rol'] = $usuario['rol'];
        $_SESSION['usuario_username'] = $usuario['username'];
        
        header('Location: dashboard.php');
        exit;
    } else {
        // Login fallido
        $error = "Credenciales incorrectas o usuario bloqueado";
    }
}

// Verificar si está logueado
if (!isset($_SESSION['usuario_id'])) {
    header('Location: login.php');
    exit;
}

// Obtener datos del usuario actual
$usuario_actual = $auth->obtenerUsuario($_SESSION['usuario_id']);

// Verificar rol
if (!$auth->tieneRol($usuario_actual, 'administrador')) {
    die('Acceso denegado. Se requiere rol de administrador.');
}

// También puedes verificar múltiples roles
if (!$auth->tieneRol($usuario_actual, ['administrador', 'cobrador'])) {
    die('Acceso denegado.');
}

// Cerrar sesión
if (isset($_GET['logout'])) {
    $auth->cerrarSesion($_SESSION['usuario_id']);
    header('Location: login.php');
    exit;
}
*/

?>
