-- =====================================================
-- SISTEMA AQUATENEX - BASE DE DATOS MYSQL
-- Sistema Integral de Administración de Pagos de Agua
-- Calera Tenextepec - San Antonio Tenextepec, Veracruz
-- =====================================================

-- Crear la base de datos
DROP DATABASE IF EXISTS aquatenex_db;
CREATE DATABASE aquatenex_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE aquatenex_db;

-- =====================================================
-- TABLA: usuarios_agua
-- Almacena el censo de usuarios del servicio de agua
-- =====================================================
CREATE TABLE usuarios_agua (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    numero_cuenta VARCHAR(20) UNIQUE NOT NULL COMMENT 'Número único de cuenta generado automáticamente',
    
    -- Datos personales
    nombre_completo VARCHAR(150) NOT NULL,
    telefono VARCHAR(15),
    email VARCHAR(100),
    identificacion_oficial VARCHAR(50) COMMENT 'CURP, INE, etc.',
    tipo_propiedad ENUM('Residencial', 'Comercial', 'Industrial') DEFAULT 'Residencial' COMMENT 'Tipo de propiedad del usuario',
    
    -- Dirección
    calle VARCHAR(150) NOT NULL,
    numero_exterior VARCHAR(10),
    numero_interior VARCHAR(10),
    colonia VARCHAR(100),
    codigo_postal VARCHAR(10) CHECK (codigo_postal REGEXP '^[0-9]{5}$'),
    referencias TEXT COMMENT 'Referencias para localizar el domicilio',
    
    -- Geolocalización
    latitud DECIMAL(10, 8) COMMENT 'Coordenada GPS latitud',
    longitud DECIMAL(11, 8) COMMENT 'Coordenada GPS longitud',
    
    -- Fotografías (rutas de archivos)
    foto_domicilio VARCHAR(255),
    foto_medidor VARCHAR(255),
    
    -- Control y estado
    estatus ENUM('activo', 'suspendido', 'baja') DEFAULT 'activo',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    notas TEXT COMMENT 'Observaciones adicionales',
    
    -- Índices para búsquedas rápidas
    INDEX idx_numero_cuenta (numero_cuenta),
    INDEX idx_nombre (nombre_completo),
    INDEX idx_estatus (estatus),
    INDEX idx_colonia (colonia),
    INDEX idx_geolocalizacion (latitud, longitud)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Censo de usuarios del servicio de agua';

-- =====================================================
-- TABLA: configuracion_tarifas
-- Almacena las tarifas y configuraciones del servicio
-- =====================================================
CREATE TABLE configuracion_tarifas (
    id_tarifa INT AUTO_INCREMENT PRIMARY KEY,
    concepto VARCHAR(100) NOT NULL COMMENT 'Descripción del concepto',
    monto DECIMAL(10, 2) NOT NULL,
    tipo_tarifa ENUM('cuota_fija', 'por_consumo', 'reconexion', 'otro') DEFAULT 'cuota_fija',
    periodo ENUM('mensual', 'bimestral', 'trimestral', 'anual') DEFAULT 'mensual',
    
    -- Control de vigencia
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    activo BOOLEAN DEFAULT TRUE,
    
    -- Recargos por mora
    dias_gracia INT DEFAULT 5 COMMENT 'Días antes de aplicar recargo',
    porcentaje_recargo DECIMAL(5, 2) DEFAULT 0.00 COMMENT 'Porcentaje de recargo por mora',
    
    -- Auditoría
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    creado_por INT COMMENT 'ID del usuario del sistema que creó el registro',
    
    INDEX idx_activo (activo),
    INDEX idx_tipo (tipo_tarifa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Configuración de tarifas y recargos';

-- =====================================================
-- TABLA: pagos
-- Almacena todos los pagos realizados por los usuarios
-- =====================================================
CREATE TABLE pagos (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    numero_recibo VARCHAR(30) UNIQUE NOT NULL COMMENT 'Número de recibo único',
    
    -- Detalles del pago
    monto_pagado DECIMAL(10, 2) NOT NULL CHECK (monto_pagado >= 0),
    monto_recargo DECIMAL(10, 2) DEFAULT 0.00 CHECK (monto_recargo >= 0),
    monto_total DECIMAL(10, 2) NOT NULL CHECK (monto_total >= 0),
    
    -- Periodo que cubre el pago
    periodo_inicio DATE NOT NULL,
    periodo_fin DATE NOT NULL,
    
    -- Información de la transacción
    metodo_pago ENUM('efectivo', 'transferencia', 'tarjeta', 'cheque', 'otro') DEFAULT 'efectivo',
    referencia_pago VARCHAR(100) COMMENT 'Número de referencia bancaria o comprobante',
    
    -- Control y auditoría
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    registrado_por INT NOT NULL COMMENT 'ID del usuario del sistema que registró el pago',
    estatus_pago ENUM('completado', 'pendiente', 'cancelado') DEFAULT 'completado',
    motivo_cancelacion TEXT COMMENT 'Razón de cancelación si aplica',
    fecha_cancelacion DATETIME,
    
    -- Observaciones
    notas TEXT,
    
    -- Relaciones
    FOREIGN KEY (id_usuario) REFERENCES usuarios_agua(id_usuario) ON DELETE RESTRICT,
    
    -- Índices
    INDEX idx_usuario (id_usuario),
    INDEX idx_fecha_pago (fecha_pago),
    INDEX idx_periodo (periodo_inicio, periodo_fin),
    INDEX idx_estatus (estatus_pago),
    INDEX idx_recibo (numero_recibo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Registro histórico de todos los pagos';

-- =====================================================
-- TABLA: estado_cuenta
-- Vista actualizada del estado de cuenta de cada usuario
-- =====================================================
CREATE TABLE estado_cuenta (
    id_estado INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    
    -- Información financiera
    saldo_pendiente DECIMAL(10, 2) DEFAULT 0.00 CHECK (saldo_pendiente >= 0),
    ultimo_pago_monto DECIMAL(10, 2) CHECK (ultimo_pago_monto >= 0),
    ultimo_pago_fecha DATE,
    
    -- Periodos
    periodos_adeudados INT DEFAULT 0,
    ultimo_periodo_pagado DATE,
    proximo_vencimiento DATE,
    
    -- Estado del servicio
    estatus_pago ENUM('al_corriente', 'proximo_vencer', 'vencido', 'moroso') DEFAULT 'al_corriente',
    dias_atraso INT DEFAULT 0,
    
    -- Control
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Relaciones
    FOREIGN KEY (id_usuario) REFERENCES usuarios_agua(id_usuario) ON DELETE CASCADE,
    
    -- Índices
    INDEX idx_estatus (estatus_pago),
    INDEX idx_saldo (saldo_pendiente),
    INDEX idx_vencimiento (proximo_vencimiento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Estado de cuenta actual de cada usuario';

-- =====================================================
-- TABLA: usuarios_sistema
-- Usuarios que operan el sistema (administradores, cobradores)
-- =====================================================
CREATE TABLE usuarios_sistema (
    id_usuario_sistema INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Credenciales
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL COMMENT 'Contraseña encriptada',
    
    -- Datos personales
    nombre_completo VARCHAR(150) NOT NULL,
    email VARCHAR(100),
    telefono VARCHAR(15),
    
    -- Permisos
    rol ENUM('administrador', 'gestor_campo', 'cobrador', 'censador', 'supervisor', 'contador', 'soporte_tecnico', 'consulta') NOT NULL,
    
    -- Estado
    activo BOOLEAN DEFAULT TRUE,
    ultimo_acceso DATETIME,
    intentos_fallidos INT DEFAULT 0,
    bloqueado BOOLEAN DEFAULT FALSE,
    
    -- Auditoría
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creado_por INT COMMENT 'ID del administrador que creó el usuario',
    
    -- Índices
    INDEX idx_username (username),
    INDEX idx_rol (rol),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Usuarios del sistema administrativo';

-- =====================================================
-- TABLA: bitacora_sistema
-- Registro de todas las acciones realizadas en el sistema
-- =====================================================
CREATE TABLE bitacora_sistema (
    id_bitacora BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Información del evento
    id_usuario_sistema INT NOT NULL,
    accion VARCHAR(100) NOT NULL COMMENT 'Tipo de acción realizada',
    modulo VARCHAR(50) COMMENT 'Módulo del sistema',
    descripcion TEXT,
    
    -- Detalles técnicos
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    
    -- Referencias
    tabla_afectada VARCHAR(50),
    id_registro_afectado INT,
    
    -- Timestamp
    fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Relaciones
    FOREIGN KEY (id_usuario_sistema) REFERENCES usuarios_sistema(id_usuario_sistema) ON DELETE RESTRICT,
    
    -- Índices
    INDEX idx_usuario (id_usuario_sistema),
    INDEX idx_fecha (fecha_hora),
    INDEX idx_accion (accion),
    INDEX idx_modulo (modulo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Auditoría de todas las operaciones del sistema';

-- =====================================================
-- TABLA: notificaciones
-- Sistema de notificaciones y recordatorios
-- =====================================================
CREATE TABLE notificaciones (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    
    -- Contenido
    tipo_notificacion ENUM('recordatorio_pago', 'vencimiento_proximo', 'pago_registrado', 'corte_programado', 'otro') NOT NULL,
    asunto VARCHAR(200),
    mensaje TEXT,
    
    -- Estado
    enviada BOOLEAN DEFAULT FALSE,
    fecha_envio DATETIME,
    leida BOOLEAN DEFAULT FALSE,
    fecha_lectura DATETIME,
    
    -- Canal
    canal ENUM('sistema', 'email', 'sms', 'whatsapp') DEFAULT 'sistema',
    
    -- Control
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Relaciones
    FOREIGN KEY (id_usuario) REFERENCES usuarios_agua(id_usuario) ON DELETE CASCADE,
    
    -- Índices
    INDEX idx_usuario (id_usuario),
    INDEX idx_enviada (enviada),
    INDEX idx_tipo (tipo_notificacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Notificaciones y alertas para usuarios';

-- =====================================================
-- TABLA: respaldos
-- Control de respaldos de la base de datos
-- =====================================================
CREATE TABLE respaldos (
    id_respaldo INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Información del respaldo
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500),
    tamanio_mb DECIMAL(10, 2),
    
    -- Tipo y estado
    tipo_respaldo ENUM('manual', 'automatico') DEFAULT 'automatico',
    estatus ENUM('exitoso', 'fallido', 'en_proceso') DEFAULT 'exitoso',
    
    -- Auditoría
    fecha_respaldo DATETIME DEFAULT CURRENT_TIMESTAMP,
    realizado_por INT,
    
    -- Observaciones
    notas TEXT,
    
    -- Relaciones
    FOREIGN KEY (realizado_por) REFERENCES usuarios_sistema(id_usuario_sistema) ON DELETE SET NULL,
    
    -- Índices
    INDEX idx_fecha (fecha_respaldo),
    INDEX idx_tipo (tipo_respaldo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Registro de respaldos de la base de datos';

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista: Usuarios con adeudos
CREATE VIEW v_usuarios_morosos AS
SELECT 
    u.id_usuario,
    u.numero_cuenta,
    u.nombre_completo,
    u.telefono,
    u.colonia,
    ec.saldo_pendiente,
    ec.periodos_adeudados,
    ec.dias_atraso,
    ec.ultimo_pago_fecha
FROM usuarios_agua u
INNER JOIN estado_cuenta ec ON u.id_usuario = ec.id_usuario
WHERE ec.estatus_pago IN ('vencido', 'moroso')
AND u.estatus = 'activo'
ORDER BY ec.dias_atraso DESC;

-- Vista: Resumen de cobranza diaria
CREATE VIEW v_cobranza_diaria AS
SELECT 
    DATE(fecha_pago) as fecha,
    COUNT(*) as total_pagos,
    SUM(monto_total) as monto_total_recaudado,
    SUM(monto_recargo) as total_recargos,
    AVG(monto_total) as promedio_pago
FROM pagos
WHERE estatus_pago = 'completado'
GROUP BY DATE(fecha_pago)
ORDER BY fecha DESC;

-- Vista: Estado general del padrón
CREATE VIEW v_resumen_padron AS
SELECT 
    COUNT(*) as total_usuarios,
    SUM(CASE WHEN estatus = 'activo' THEN 1 ELSE 0 END) as usuarios_activos,
    SUM(CASE WHEN estatus = 'suspendido' THEN 1 ELSE 0 END) as usuarios_suspendidos,
    SUM(CASE WHEN estatus = 'baja' THEN 1 ELSE 0 END) as usuarios_baja
FROM usuarios_agua;

-- Vista: Reporte de cobranza por colonia
CREATE VIEW v_cobranza_por_colonia AS
SELECT 
    u.colonia,
    COUNT(DISTINCT u.id_usuario) as total_usuarios,
    COUNT(p.id_pago) as total_pagos,
    COALESCE(SUM(p.monto_total), 0) as total_recaudado,
    COALESCE(AVG(p.monto_total), 0) as promedio_pago
FROM usuarios_agua u
LEFT JOIN pagos p ON u.id_usuario = p.id_usuario 
    AND p.estatus_pago = 'completado'
    AND YEAR(p.fecha_pago) = YEAR(CURRENT_DATE)
WHERE u.estatus = 'activo'
GROUP BY u.colonia
ORDER BY total_recaudado DESC;

-- Vista: Usuarios próximos a vencer
CREATE VIEW v_usuarios_proximos_vencer AS
SELECT 
    u.id_usuario,
    u.numero_cuenta,
    u.nombre_completo,
    u.telefono,
    u.email,
    u.colonia,
    ec.proximo_vencimiento,
    DATEDIFF(ec.proximo_vencimiento, CURRENT_DATE) as dias_restantes,
    ec.saldo_pendiente
FROM usuarios_agua u
INNER JOIN estado_cuenta ec ON u.id_usuario = ec.id_usuario
WHERE ec.estatus_pago = 'proximo_vencer'
AND u.estatus = 'activo'
ORDER BY ec.proximo_vencimiento ASC;

-- =====================================================
-- TRIGGERS PARA AUTOMATIZACIÓN
-- =====================================================

-- Trigger: Generar número de cuenta automáticamente
DELIMITER //
CREATE TRIGGER trg_generar_numero_cuenta
BEFORE INSERT ON usuarios_agua
FOR EACH ROW
BEGIN
    IF NEW.numero_cuenta IS NULL OR NEW.numero_cuenta = '' THEN
        SET NEW.numero_cuenta = CONCAT('TNXT-', LPAD(NEW.id_usuario, 6, '0'));
    END IF;
END//
DELIMITER ;

-- Trigger: Generar número de recibo automáticamente
DELIMITER //
CREATE TRIGGER trg_generar_numero_recibo
BEFORE INSERT ON pagos
FOR EACH ROW
BEGIN
    DECLARE ultimo_recibo INT;
    SELECT COALESCE(MAX(CAST(SUBSTRING(numero_recibo, 6) AS UNSIGNED)), 0) INTO ultimo_recibo
    FROM pagos
    WHERE YEAR(fecha_pago) = YEAR(CURRENT_DATE);
    
    SET NEW.numero_recibo = CONCAT('REC-', YEAR(CURRENT_DATE), '-', LPAD(ultimo_recibo + 1, 6, '0'));
END//
DELIMITER ;

-- Trigger: Actualizar estado de cuenta al registrar pago
DELIMITER //
CREATE TRIGGER trg_actualizar_estado_cuenta
AFTER INSERT ON pagos
FOR EACH ROW
BEGIN
    IF NEW.estatus_pago = 'completado' THEN
        -- Actualizar o insertar estado de cuenta
        INSERT INTO estado_cuenta (
            id_usuario, 
            ultimo_pago_monto, 
            ultimo_pago_fecha, 
            ultimo_periodo_pagado
        )
        VALUES (
            NEW.id_usuario,
            NEW.monto_total,
            NEW.fecha_pago,
            NEW.periodo_fin
        )
        ON DUPLICATE KEY UPDATE
            ultimo_pago_monto = NEW.monto_total,
            ultimo_pago_fecha = NEW.fecha_pago,
            ultimo_periodo_pagado = NEW.periodo_fin,
            fecha_actualizacion = CURRENT_TIMESTAMP;
    END IF;
END//
DELIMITER ;

-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS ÚTILES
-- =====================================================

-- Procedimiento: Recalcular estado de cuenta de un usuario
DELIMITER //
CREATE PROCEDURE sp_recalcular_estado_cuenta(IN p_id_usuario INT)
BEGIN
    DECLARE v_saldo DECIMAL(10,2);
    DECLARE v_ultimo_pago_monto DECIMAL(10,2);
    DECLARE v_ultimo_pago_fecha DATE;
    DECLARE v_ultimo_periodo_pagado DATE;
    DECLARE v_periodos_adeudados INT;
    DECLARE v_dias_atraso INT;
    DECLARE v_estatus VARCHAR(20);
    DECLARE v_proximo_vencimiento DATE;
    
    -- Obtener información del último pago
    SELECT monto_total, DATE(fecha_pago), periodo_fin
    INTO v_ultimo_pago_monto, v_ultimo_pago_fecha, v_ultimo_periodo_pagado
    FROM pagos
    WHERE id_usuario = p_id_usuario 
    AND estatus_pago = 'completado'
    ORDER BY fecha_pago DESC
    LIMIT 1;
    
    -- Calcular periodos adeudados (asumiendo pago mensual)
    SET v_periodos_adeudados = TIMESTAMPDIFF(MONTH, 
        COALESCE(v_ultimo_periodo_pagado, (SELECT fecha_registro FROM usuarios_agua WHERE id_usuario = p_id_usuario)), 
        CURRENT_DATE
    );
    
    IF v_periodos_adeudados < 0 THEN
        SET v_periodos_adeudados = 0;
    END IF;
    
    -- Calcular saldo pendiente
    SELECT COALESCE(v_periodos_adeudados * monto, 0)
    INTO v_saldo
    FROM configuracion_tarifas
    WHERE activo = TRUE AND tipo_tarifa = 'cuota_fija'
    LIMIT 1;
    
    -- Calcular próximo vencimiento
    SET v_proximo_vencimiento = DATE_ADD(
        COALESCE(v_ultimo_periodo_pagado, (SELECT fecha_registro FROM usuarios_agua WHERE id_usuario = p_id_usuario)),
        INTERVAL 1 MONTH
    );
    
    -- Calcular días de atraso
    SET v_dias_atraso = DATEDIFF(CURRENT_DATE, v_proximo_vencimiento);
    IF v_dias_atraso < 0 THEN
        SET v_dias_atraso = 0;
    END IF;
    
    -- Determinar estatus
    IF v_periodos_adeudados = 0 THEN
        SET v_estatus = 'al_corriente';
    ELSEIF v_dias_atraso <= 5 THEN
        SET v_estatus = 'proximo_vencer';
    ELSEIF v_dias_atraso <= 30 THEN
        SET v_estatus = 'vencido';
    ELSE
        SET v_estatus = 'moroso';
    END IF;
    
    -- Actualizar o insertar estado de cuenta
    INSERT INTO estado_cuenta (
        id_usuario, saldo_pendiente, ultimo_pago_monto, ultimo_pago_fecha,
        periodos_adeudados, ultimo_periodo_pagado, proximo_vencimiento,
        estatus_pago, dias_atraso
    )
    VALUES (
        p_id_usuario, v_saldo, v_ultimo_pago_monto, v_ultimo_pago_fecha,
        v_periodos_adeudados, v_ultimo_periodo_pagado, v_proximo_vencimiento,
        v_estatus, v_dias_atraso
    )
    ON DUPLICATE KEY UPDATE
        saldo_pendiente = v_saldo,
        ultimo_pago_monto = v_ultimo_pago_monto,
        ultimo_pago_fecha = v_ultimo_pago_fecha,
        periodos_adeudados = v_periodos_adeudados,
        ultimo_periodo_pagado = v_ultimo_periodo_pagado,
        proximo_vencimiento = v_proximo_vencimiento,
        estatus_pago = v_estatus,
        dias_atraso = v_dias_atraso;
END//
DELIMITER ;

-- Procedimiento: Calcular adeudos de un usuario
DELIMITER //
CREATE PROCEDURE sp_calcular_adeudo(IN p_id_usuario INT)
BEGIN
    SELECT 
        u.numero_cuenta,
        u.nombre_completo,
        ec.saldo_pendiente,
        ec.periodos_adeudados,
        ec.dias_atraso,
        ec.ultimo_pago_fecha,
        ec.proximo_vencimiento,
        (SELECT monto FROM configuracion_tarifas WHERE activo = TRUE AND tipo_tarifa = 'cuota_fija' LIMIT 1) as monto_periodo,
        (ec.periodos_adeudados * (SELECT monto FROM configuracion_tarifas WHERE activo = TRUE AND tipo_tarifa = 'cuota_fija' LIMIT 1)) as total_adeudado
    FROM usuarios_agua u
    INNER JOIN estado_cuenta ec ON u.id_usuario = ec.id_usuario
    WHERE u.id_usuario = p_id_usuario;
END//
DELIMITER ;

-- Procedimiento: Reporte de cobranza por periodo
DELIMITER //
CREATE PROCEDURE sp_reporte_cobranza(IN p_fecha_inicio DATE, IN p_fecha_fin DATE)
BEGIN
    SELECT 
        DATE(p.fecha_pago) as fecha,
        COUNT(p.id_pago) as num_pagos,
        SUM(p.monto_pagado) as monto_base,
        SUM(p.monto_recargo) as recargos,
        SUM(p.monto_total) as total_recaudado,
        us.nombre_completo as cobrador
    FROM pagos p
    INNER JOIN usuarios_sistema us ON p.registrado_por = us.id_usuario_sistema
    WHERE DATE(p.fecha_pago) BETWEEN p_fecha_inicio AND p_fecha_fin
    AND p.estatus_pago = 'completado'
    GROUP BY DATE(p.fecha_pago), us.nombre_completo
    ORDER BY fecha DESC;
END//
DELIMITER ;

-- Procedimiento: Generar notificaciones automáticas de vencimiento
DELIMITER //
CREATE PROCEDURE sp_generar_notificaciones_vencimiento()
BEGIN
    -- Notificar usuarios próximos a vencer (5 días antes)
    INSERT INTO notificaciones (id_usuario, tipo_notificacion, asunto, mensaje, canal)
    SELECT 
        ec.id_usuario,
        'vencimiento_proximo',
        'Recordatorio de Pago',
        CONCAT('Estimado usuario, su próximo pago vence el ', DATE_FORMAT(ec.proximo_vencimiento, '%d/%m/%Y'), '. Evite recargos pagando a tiempo.'),
        'sistema'
    FROM estado_cuenta ec
    WHERE ec.proximo_vencimiento = DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY)
    AND ec.estatus_pago = 'al_corriente'
    AND NOT EXISTS (
        SELECT 1 FROM notificaciones n 
        WHERE n.id_usuario = ec.id_usuario 
        AND n.tipo_notificacion = 'vencimiento_proximo'
        AND DATE(n.fecha_creacion) = CURRENT_DATE
    );
    
    -- Notificar usuarios con pagos vencidos
    INSERT INTO notificaciones (id_usuario, tipo_notificacion, asunto, mensaje, canal)
    SELECT 
        ec.id_usuario,
        'recordatorio_pago',
        'Pago Vencido',
        CONCAT('Estimado usuario, tiene ', ec.periodos_adeudados, ' periodo(s) vencido(s). Adeudo: $', ec.saldo_pendiente, '. Por favor regularice su situación.'),
        'sistema'
    FROM estado_cuenta ec
    WHERE ec.estatus_pago IN ('vencido', 'moroso')
    AND NOT EXISTS (
        SELECT 1 FROM notificaciones n 
        WHERE n.id_usuario = ec.id_usuario 
        AND n.tipo_notificacion = 'recordatorio_pago'
        AND DATE(n.fecha_creacion) = CURRENT_DATE
    );
END//
DELIMITER ;

-- Procedimiento: Respaldo automático (solo registra en la tabla)
DELIMITER //
CREATE PROCEDURE sp_registrar_respaldo(
    IN p_nombre_archivo VARCHAR(255),
    IN p_ruta_archivo VARCHAR(500),
    IN p_tamanio_mb DECIMAL(10,2),
    IN p_tipo_respaldo ENUM('manual', 'automatico'),
    IN p_realizado_por INT
)
BEGIN
    INSERT INTO respaldos (nombre_archivo, ruta_archivo, tamanio_mb, tipo_respaldo, realizado_por, estatus)
    VALUES (p_nombre_archivo, p_ruta_archivo, p_tamanio_mb, p_tipo_respaldo, p_realizado_por, 'exitoso');
END//
DELIMITER ;

-- Procedimiento: Calcular distancia entre dos puntos (en kilómetros)
DELIMITER //
CREATE PROCEDURE sp_calcular_distancia(
    IN p_lat1 DECIMAL(10,8),
    IN p_lon1 DECIMAL(11,8),
    IN p_lat2 DECIMAL(10,8),
    IN p_lon2 DECIMAL(11,8),
    OUT p_distancia_km DECIMAL(10,3)
)
BEGIN
    -- Fórmula de Haversine para calcular distancia entre dos coordenadas GPS
    SET p_distancia_km = (
        6371 * ACOS(
            COS(RADIANS(p_lat1)) * COS(RADIANS(p_lat2)) * 
            COS(RADIANS(p_lon2) - RADIANS(p_lon1)) + 
            SIN(RADIANS(p_lat1)) * SIN(RADIANS(p_lat2))
        )
    );
END//
DELIMITER ;

-- Procedimiento: Obtener usuarios cercanos a una ubicación (radio en km)
DELIMITER //
CREATE PROCEDURE sp_usuarios_cercanos(
    IN p_latitud DECIMAL(10,8),
    IN p_longitud DECIMAL(11,8),
    IN p_radio_km DECIMAL(10,3)
)
BEGIN
    SELECT 
        u.id_usuario,
        u.numero_cuenta,
        u.nombre_completo,
        u.telefono,
        u.calle,
        u.colonia,
        u.latitud,
        u.longitud,
        ec.estatus_pago,
        (
            6371 * ACOS(
                COS(RADIANS(p_latitud)) * COS(RADIANS(u.latitud)) * 
                COS(RADIANS(u.longitud) - RADIANS(p_longitud)) + 
                SIN(RADIANS(p_latitud)) * SIN(RADIANS(u.latitud))
            )
        ) AS distancia_km
    FROM usuarios_agua u
    LEFT JOIN estado_cuenta ec ON u.id_usuario = ec.id_usuario
    WHERE u.latitud IS NOT NULL 
    AND u.longitud IS NOT NULL
    AND u.estatus = 'activo'
    HAVING distancia_km <= p_radio_km
    ORDER BY distancia_km ASC;
END//
DELIMITER ;

-- Procedimiento: Generar ruta de cobro optimizada por zona
DELIMITER //
CREATE PROCEDURE sp_ruta_cobro_por_zona(
    IN p_colonia VARCHAR(100),
    IN p_estatus_pago VARCHAR(20)
)
BEGIN
    SELECT 
        u.id_usuario,
        u.numero_cuenta,
        u.nombre_completo,
        u.telefono,
        u.calle,
        u.numero_exterior,
        u.colonia,
        u.latitud,
        u.longitud,
        ec.saldo_pendiente,
        ec.periodos_adeudados,
        ec.dias_atraso,
        ec.estatus_pago
    FROM usuarios_agua u
    INNER JOIN estado_cuenta ec ON u.id_usuario = ec.id_usuario
    WHERE u.estatus = 'activo'
    AND (p_colonia IS NULL OR u.colonia = p_colonia)
    AND (p_estatus_pago IS NULL OR ec.estatus_pago = p_estatus_pago)
    AND u.latitud IS NOT NULL
    AND u.longitud IS NOT NULL
    ORDER BY u.colonia, u.calle, u.numero_exterior;
END//
DELIMITER ;

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar usuario administrador por defecto
-- NOTA: La contraseña debe ser cifrada con bcrypt usando el script Python incluido
-- Password por defecto: admin123
INSERT INTO usuarios_sistema (username, password_hash, nombre_completo, email, rol) 
VALUES ('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5KeYZIiOqKx6i', 'Administrador del Sistema', 'admin@aquatenex.com', 'administrador');

-- Insertar tarifa básica inicial
INSERT INTO configuracion_tarifas (concepto, monto, tipo_tarifa, periodo, fecha_inicio, dias_gracia, porcentaje_recargo, creado_por)
VALUES ('Cuota Mensual Básica', 100.00, 'cuota_fija', 'mensual', CURRENT_DATE, 5, 10.00, 1);

-- =====================================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- =====================================================

-- Índice compuesto para búsquedas frecuentes
ALTER TABLE pagos ADD INDEX idx_usuario_fecha (id_usuario, fecha_pago);
ALTER TABLE bitacora_sistema ADD INDEX idx_usuario_fecha (id_usuario_sistema, fecha_hora);

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

-- Verificar creación de tablas
SHOW TABLES;

-- Mensaje de confirmación
SELECT 'Base de datos AquaTenex creada exitosamente' AS mensaje;