# 🛠️ COMANDOS ÚTILES - AQUATENEX

## Guía rápida de comandos para operación diaria

---

## 🐍 PYTHON - Gestor de Contraseñas

### Ejecutar el gestor principal:
```bash
cd c:\xampp\htdocs\Proyecto_CT
python password_manager.py
```

### Ejecutar suite de pruebas:
```bash
python test_password_manager.py
```

### Actualizar contraseña del admin:
```bash
python actualizar_admin.py
```

### Generar hash de prueba:
```bash
python generar_hash.py
```

---

## 🗄️ MYSQL/MARIADB - Comandos de base de datos

### Conectar a MySQL:
```bash
C:\xampp\mysql\bin\mysql.exe -u root
```

### Usar la base de datos:
```sql
USE aquatenex_db;
```

### Ver todas las tablas:
```sql
SHOW TABLES;
```

### Listar usuarios del sistema:
```sql
SELECT 
    username, 
    nombre_completo, 
    email, 
    rol, 
    activo, 
    bloqueado 
FROM usuarios_sistema;
```

### Ver usuario específico:
```sql
SELECT * FROM usuarios_sistema WHERE username = 'admin';
```

### Ver todos los usuarios del agua:
```sql
SELECT 
    numero_cuenta, 
    nombre_completo, 
    telefono, 
    colonia, 
    estatus 
FROM usuarios_agua 
LIMIT 10;
```

### Ver pagos recientes:
```sql
SELECT 
    p.numero_recibo,
    u.nombre_completo,
    p.monto_total,
    p.fecha_pago
FROM pagos p
JOIN usuarios_agua u ON p.id_usuario = u.id_usuario
ORDER BY p.fecha_pago DESC
LIMIT 10;
```

### Ver usuarios morosos:
```sql
SELECT * FROM v_usuarios_morosos LIMIT 10;
```

### Ver cobranza diaria:
```sql
SELECT * FROM v_cobranza_diaria LIMIT 7;
```

### Ver cobranza por colonia:
```sql
SELECT * FROM v_cobranza_por_colonia;
```

### Ver usuarios próximos a vencer:
```sql
SELECT * FROM v_usuarios_proximos_vencer LIMIT 10;
```

### Calcular adeudo de un usuario:
```sql
CALL sp_calcular_adeudo(1);
```

### Recalcular estado de cuenta:
```sql
CALL sp_recalcular_estado_cuenta(1);
```

### Generar notificaciones:
```sql
CALL sp_generar_notificaciones_vencimiento();
```

### Ver reporte de cobranza:
```sql
CALL sp_reporte_cobranza('2025-01-01', '2025-12-31');
```

### Ver bitácora reciente:
```sql
SELECT 
    us.username,
    b.accion,
    b.descripcion,
    b.fecha_hora
FROM bitacora_sistema b
JOIN usuarios_sistema us ON b.id_usuario_sistema = us.id_usuario_sistema
ORDER BY b.fecha_hora DESC
LIMIT 20;
```

### Verificar estructura de una tabla:
```sql
DESCRIBE usuarios_sistema;
```

### Ver estadísticas generales:
```sql
SELECT * FROM v_resumen_padron;
```

---

## 💾 RESPALDOS

### Crear respaldo de la base de datos:
```bash
C:\xampp\mysql\bin\mysqldump.exe -u root aquatenex_db > backup_aquatenex_$(Get-Date -Format 'yyyyMMdd').sql
```

### Restaurar desde respaldo:
```bash
Get-Content backup_aquatenex_20251105.sql | C:\xampp\mysql\bin\mysql.exe -u root aquatenex_db
```

### Respaldo solo de estructura (sin datos):
```bash
C:\xampp\mysql\bin\mysqldump.exe -u root --no-data aquatenex_db > estructura_aquatenex.sql
```

### Respaldo solo de datos:
```bash
C:\xampp\mysql\bin\mysqldump.exe -u root --no-create-info aquatenex_db > datos_aquatenex.sql
```

---

## 🔧 MANTENIMIENTO

### Ver tamaño de las tablas:
```sql
SELECT 
    table_name AS 'Tabla',
    ROUND((data_length + index_length) / 1024 / 1024, 2) AS 'Tamaño (MB)'
FROM information_schema.tables
WHERE table_schema = 'aquatenex_db'
ORDER BY (data_length + index_length) DESC;
```

### Optimizar todas las tablas:
```sql
OPTIMIZE TABLE usuarios_agua;
OPTIMIZE TABLE pagos;
OPTIMIZE TABLE usuarios_sistema;
OPTIMIZE TABLE bitacora_sistema;
OPTIMIZE TABLE estado_cuenta;
OPTIMIZE TABLE notificaciones;
OPTIMIZE TABLE configuracion_tarifas;
OPTIMIZE TABLE respaldos;
```

### Ver procesos activos:
```sql
SHOW PROCESSLIST;
```

### Ver variables del servidor:
```sql
SHOW VARIABLES LIKE '%version%';
```

---

## 🔍 CONSULTAS ÚTILES

### Buscar usuario por nombre:
```sql
SELECT * FROM usuarios_agua 
WHERE nombre_completo LIKE '%juan%';
```

### Buscar por número de cuenta:
```sql
SELECT * FROM usuarios_agua 
WHERE numero_cuenta = 'TNXT-000001';
```

### Buscar por colonia:
```sql
SELECT * FROM usuarios_agua 
WHERE colonia = 'Centro';
```

### Ver pagos de un usuario:
```sql
SELECT 
    numero_recibo,
    monto_total,
    fecha_pago,
    periodo_inicio,
    periodo_fin
FROM pagos
WHERE id_usuario = 1
ORDER BY fecha_pago DESC;
```

### Total recaudado en el mes:
```sql
SELECT 
    SUM(monto_total) as total_recaudado,
    COUNT(*) as num_pagos
FROM pagos
WHERE MONTH(fecha_pago) = MONTH(CURRENT_DATE)
AND YEAR(fecha_pago) = YEAR(CURRENT_DATE)
AND estatus_pago = 'completado';
```

### Usuarios sin pagos:
```sql
SELECT u.*
FROM usuarios_agua u
LEFT JOIN pagos p ON u.id_usuario = p.id_usuario
WHERE p.id_pago IS NULL
AND u.estatus = 'activo';
```

---

## 👥 GESTIÓN DE USUARIOS DEL SISTEMA

### Crear usuario (usar el gestor Python):
```bash
python password_manager.py
# Seleccionar opción 1
```

### Actualizar contraseña:
```bash
python password_manager.py
# Seleccionar opción 2
```

### Desbloquear usuario:
```sql
UPDATE usuarios_sistema 
SET bloqueado = FALSE, intentos_fallidos = 0 
WHERE username = 'usuario';
```

### Desactivar usuario:
```sql
UPDATE usuarios_sistema 
SET activo = FALSE 
WHERE username = 'usuario';
```

### Activar usuario:
```sql
UPDATE usuarios_sistema 
SET activo = TRUE 
WHERE username = 'usuario';
```

---

## 📊 REPORTES RÁPIDOS

### Resumen del día:
```sql
SELECT 
    DATE(fecha_pago) as fecha,
    COUNT(*) as pagos_realizados,
    SUM(monto_total) as total_recaudado
FROM pagos
WHERE DATE(fecha_pago) = CURRENT_DATE
AND estatus_pago = 'completado';
```

### Top 10 usuarios con más adeudos:
```sql
SELECT 
    numero_cuenta,
    nombre_completo,
    telefono,
    saldo_pendiente,
    periodos_adeudados
FROM v_usuarios_morosos
LIMIT 10;
```

### Usuarios activos por colonia:
```sql
SELECT 
    colonia,
    COUNT(*) as total_usuarios
FROM usuarios_agua
WHERE estatus = 'activo'
GROUP BY colonia
ORDER BY total_usuarios DESC;
```

---

## 🚨 SOLUCIÓN DE PROBLEMAS

### Error: "Can't connect to MySQL server":
```bash
# Verificar que XAMPP esté corriendo
# Ir a: C:\xampp\xampp-control.exe
# Iniciar el servicio MySQL
```

### Error: "Access denied for user 'root'":
```bash
# Verificar configuración en password_manager.py
# Asegurarse que password esté vacío: 'password': ''
```

### Error: "Database doesn't exist":
```bash
# Reimportar la base de datos
Get-Content .\aquatenex_db.sql | C:\xampp\mysql\bin\mysql.exe -u root
```

### Error: "bcrypt not found":
```bash
# Reinstalar dependencias
.\instalar_dependencias.bat
```

### Resetear contraseña del admin:
```bash
python actualizar_admin.py
```

---

## 📱 INTEGRACIÓN PHP

### Verificar credenciales en PHP:
```php
require_once 'AquaTenexAuth.php';
$auth = new AquaTenexAuth();

if ($auth->verificarCredenciales($username, $password)) {
    echo "Login exitoso";
} else {
    echo "Credenciales incorrectas";
}
```

### Verificar rol:
```php
if ($auth->tieneRol($usuario, 'administrador')) {
    // Usuario es administrador
}

if ($auth->tieneRol($usuario, ['administrador', 'cobrador'])) {
    // Usuario es admin o cobrador
}
```

---

## 🔄 TAREAS PERIÓDICAS

### Diarias:
```sql
-- Generar notificaciones de vencimiento
CALL sp_generar_notificaciones_vencimiento();

-- Ver intentos fallidos del día
SELECT username, intentos_fallidos, bloqueado
FROM usuarios_sistema
WHERE intentos_fallidos > 0;
```

### Semanales:
```sql
-- Reporte de cobranza semanal
CALL sp_reporte_cobranza(DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY), CURRENT_DATE);

-- Optimizar tablas
OPTIMIZE TABLE pagos;
OPTIMIZE TABLE bitacora_sistema;
```

### Mensuales:
```bash
# Crear respaldo mensual
C:\xampp\mysql\bin\mysqldump.exe -u root aquatenex_db > backup_mensual_$(Get-Date -Format 'yyyyMM').sql
```

---

## 💡 TIPS Y TRUCOS

### Ver comandos recientes en MySQL:
Presiona la tecla **↑** (flecha arriba) en la consola MySQL

### Limpiar pantalla en MySQL:
```sql
\! cls
```
o
```sql
system cls
```

### Salir de MySQL:
```sql
EXIT;
```
o simplemente:
```sql
QUIT;
```

### Ejecutar un archivo SQL:
```sql
SOURCE c:/xampp/htdocs/Proyecto_CT/mi_script.sql;
```

### Ver ayuda en MySQL:
```sql
HELP;
```

---

## 📞 CONTACTOS Y RECURSOS

### Documentación:
- `README_PASSWORD_MANAGER.md` - Guía del gestor
- `RESUMEN_MEJORAS.md` - Resumen de mejoras
- `REPORTE_VERIFICACION.md` - Reporte de verificación
- Este archivo - Comandos útiles

### Archivos importantes:
- `password_manager.py` - Gestor principal
- `AquaTenexAuth.php` - Clase PHP
- `aquatenex_db.sql` - Base de datos

---

**Última actualización:** 05 de Noviembre de 2025  
**Sistema:** AquaTenex - Calera Tenextepec, Veracruz

---

*Guarda este archivo para referencia rápida*
