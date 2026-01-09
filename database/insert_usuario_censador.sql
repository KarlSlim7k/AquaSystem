-- =====================================================
-- INSERTAR USUARIO CENSADOR
-- Script SQL para crear el usuario tipo censador
-- =====================================================
-- NOTA: Este script es una alternativa manual al script Python
-- El hash de contraseña ya está generado con bcrypt
-- =====================================================

USE aquatenex_db;

-- Insertar usuario censador
-- Username: censador
-- Password: censa123 (hash generado con bcrypt, 12 rondas)
INSERT INTO usuarios_sistema (
    username, 
    password_hash, 
    nombre_completo, 
    email, 
    rol, 
    activo,
    telefono
) VALUES (
    'censador',
    '$2b$12$Jjhn2Zmx5lHEG9xJIPFHbesYjBy8/pVsqg9iEPEkM2Dy.9mD9Ewaa',
    'Usuario Censador',
    'censador@aquatenex.com',
    'censador',
    TRUE,
    NULL
);

-- Verificar que se insertó correctamente
SELECT 
    id_usuario_sistema,
    username,
    nombre_completo,
    email,
    rol,
    activo,
    fecha_creacion
FROM usuarios_sistema
WHERE username = 'censador';

-- Mensaje de confirmación
SELECT 'Usuario censador creado exitosamente' AS mensaje;

-- =====================================================
-- INFORMACIÓN DEL USUARIO CREADO
-- =====================================================
-- Username:     censador
-- Password:     censa123
-- Rol:          censador
-- Permisos:     
--   - Acceso a formulario de censo de usuarios
--   - Visualización de lista de usuarios
--   - Sin acceso a dashboard, pagos, mapa ni estadísticas
-- =====================================================
