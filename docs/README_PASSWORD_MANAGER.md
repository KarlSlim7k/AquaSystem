# 🔐 AquaTenex - Gestor de Contraseñas

Sistema de cifrado y gestión de credenciales usando **bcrypt** para el sistema AquaTenex.

---

## 📋 Requisitos Previos

### 1. Python 3.7 o superior
Verifica tu versión de Python:
```bash
python --version
```

### 2. Instalar dependencias
```bash
pip install bcrypt mysql-connector-python
```

---

## 🚀 Instalación y Configuración

### Paso 1: Configurar conexión a la base de datos

Edita el archivo `password_manager.py` y ajusta la configuración de la base de datos:

```python
DB_CONFIG = {
    'host': 'localhost',
    'database': 'aquatenex_db',
    'user': 'root',        # Tu usuario MySQL
    'password': ''         # Tu contraseña MySQL
}
```

### Paso 2: Ejecutar el script de base de datos

Primero, ejecuta el archivo SQL para crear la base de datos:

```bash
mysql -u root -p < aquatenex_db.sql
```

O desde MySQL Workbench/phpMyAdmin, importa el archivo `aquatenex_db.sql`.

---

## 💻 Uso del Programa

### Ejecutar el programa

```bash
python password_manager.py
```

### Opciones del menú

```
1. Crear nuevo usuario
2. Actualizar contraseña de usuario existente
3. Verificar credenciales
4. Generar hash de contraseña (solo ver)
5. Listar usuarios del sistema
6. Salir
```

---

## 📝 Ejemplos de Uso

### 1️⃣ Crear un nuevo usuario

```
Opción: 1
Username: jperez
Nombre completo: Juan Pérez García
Email: jperez@aquatenex.com
Seleccione rol [1-3]: 2  (cobrador)
Contraseña: ******
Confirmar contraseña: ******

✓ Usuario 'jperez' creado exitosamente
```

### 2️⃣ Actualizar contraseña

```
Opción: 2
Username del usuario: jperez
Nueva contraseña: ******
Confirmar nueva contraseña: ******

✓ Contraseña actualizada para 'jperez'
```

### 3️⃣ Verificar credenciales

```
Opción: 3
Username: admin
Contraseña: ******

✓ Credenciales correctas
  - Usuario: admin
  - Nombre: Administrador del Sistema
  - Rol: administrador
```

### 4️⃣ Generar hash (sin guardar en BD)

```
Opción: 4
Contraseña a cifrar: ******

✓ Hash generado:
  $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5KeYZIiOqKx6i

Longitud: 60 caracteres
```

### 5️⃣ Listar usuarios

```
Opción: 5

====================================================================================================
LISTA DE USUARIOS DEL SISTEMA
====================================================================================================
Username             Nombre                          Email                          Rol              Estado    
----------------------------------------------------------------------------------------------------
admin                Administrador del Sistema       admin@aquatenex.com            administrador    ACTIVO    
jperez               Juan Pérez García               jperez@aquatenex.com           cobrador         ACTIVO    
====================================================================================================
Total: 2 usuarios
```

---

## 🔒 Seguridad

### Características de Seguridad Implementadas

1. **Bcrypt con 12 rondas**: Balance óptimo entre seguridad y rendimiento
2. **Salt único por contraseña**: Cada hash es único
3. **Contraseñas nunca almacenadas en texto plano**
4. **getpass**: Las contraseñas no se muestran al escribirlas
5. **Validación de longitud mínima**: 6 caracteres mínimo
6. **Control de intentos fallidos**: En la base de datos
7. **Sistema de bloqueo**: Usuarios pueden ser bloqueados

### Recomendaciones de Seguridad

✅ **HACER:**
- Usar contraseñas de al menos 8 caracteres
- Incluir mayúsculas, minúsculas, números y símbolos
- Cambiar contraseñas periódicamente
- Mantener este script en ubicación segura
- Restringir acceso solo a administradores

❌ **NO HACER:**
- Compartir el archivo `password_manager.py` con usuarios no autorizados
- Guardar contraseñas en texto plano
- Usar contraseñas simples o predecibles
- Dejar sesiones abiertas sin supervisión
- Compartir credenciales de administrador

---

## 🛠️ Mejoras Implementadas en la Base de Datos

### 1. Seguridad mejorada
- ✅ Bcrypt en lugar de SHA2 para contraseñas
- ✅ Hash inicial del usuario admin actualizado

### 2. Validaciones añadidas
- ✅ CHECK constraints para montos positivos
- ✅ CHECK constraint para código postal (5 dígitos)
- ✅ Validación de saldo pendiente no negativo

### 3. Nuevos procedimientos almacenados
- ✅ `sp_recalcular_estado_cuenta`: Recalcula el estado de cuenta completo
- ✅ `sp_generar_notificaciones_vencimiento`: Genera notificaciones automáticas
- ✅ `sp_registrar_respaldo`: Registra respaldos en la base de datos

### 4. Nuevas vistas
- ✅ `v_cobranza_por_colonia`: Reporte de cobranza agrupado por colonia
- ✅ `v_usuarios_proximos_vencer`: Usuarios próximos a vencer para seguimiento

### 5. Mejoras en triggers
- ✅ Trigger de estado de cuenta con INSERT ON DUPLICATE KEY UPDATE

---

## 🔧 Solución de Problemas

### Error: "bcrypt no está instalado"
```bash
pip install bcrypt
```

### Error: "mysql-connector-python no está instalado"
```bash
pip install mysql-connector-python
```

### Error: "No hay conexión a la base de datos"
- Verifica que MySQL esté corriendo
- Verifica usuario y contraseña en DB_CONFIG
- Verifica que la base de datos 'aquatenex_db' exista

### Error: "Access denied"
- Verifica las credenciales en DB_CONFIG
- Asegúrate que el usuario tenga permisos

---

## 📊 Estructura del Hash Bcrypt

Un hash bcrypt tiene este formato:
```
$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5KeYZIiOqKx6i
│  │  │  └─────────────────────────────────────────────┘
│  │  │                    Hash (31 chars)
│  │  └─────────── Salt (22 chars)
│  └──────────── Rounds (12 = 2^12 = 4096 iteraciones)
└─────────────── Identificador de algoritmo ($2b = bcrypt)
```

### Ventajas de bcrypt:
- **Lento por diseño**: Protege contra ataques de fuerza bruta
- **Salt integrado**: Cada contraseña tiene un salt único
- **Escalable**: El número de rondas puede aumentarse con el tiempo
- **Battle-tested**: Usado por empresas Fortune 500

---

## 📱 Integración con tu Sistema

### En PHP (ejemplo):
```php
<?php
// Verificar contraseña
$username = $_POST['username'];
$password = $_POST['password'];

// Obtener hash de la BD
$stmt = $pdo->prepare("SELECT password_hash FROM usuarios_sistema WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch();

// Verificar
if (password_verify($password, $user['password_hash'])) {
    // Contraseña correcta
    echo "Login exitoso";
} else {
    // Contraseña incorrecta
    echo "Credenciales inválidas";
}
?>
```

### En Python (ejemplo):
```python
import bcrypt

def verificar_login(username, password, hash_bd):
    return bcrypt.checkpw(password.encode('utf-8'), hash_bd.encode('utf-8'))
```

---

## 📞 Soporte

Para cualquier duda o problema con el sistema de contraseñas:

1. Revisa este README
2. Verifica los logs de MySQL
3. Contacta al administrador del sistema

---

## 📄 Licencia

Este software es de uso interno exclusivo para el sistema AquaTenex.

---

## 🔄 Historial de Cambios

### Versión 1.0.0 (2025-11-05)
- ✅ Implementación inicial
- ✅ Cifrado con bcrypt (12 rondas)
- ✅ Menú interactivo completo
- ✅ Gestión de usuarios
- ✅ Verificación de credenciales
- ✅ Integración con base de datos MySQL

---

**Desarrollado para AquaTenex - Sistema de Administración de Agua**  
*Calera Tenextepec - San Antonio Tenextepec, Veracruz*
