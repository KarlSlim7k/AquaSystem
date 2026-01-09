-- =====================================================
-- Script para agregar campo tipo_propiedad
-- a la tabla usuarios_agua existente
-- =====================================================

USE aquatenex_db;

-- Agregar columna tipo_propiedad si no existe
ALTER TABLE usuarios_agua 
ADD COLUMN IF NOT EXISTS tipo_propiedad ENUM('Residencial', 'Comercial', 'Industrial') 
DEFAULT 'Residencial' 
COMMENT 'Tipo de propiedad del usuario'
AFTER identificacion_oficial;

-- Actualizar registros existentes con el valor por defecto
UPDATE usuarios_agua 
SET tipo_propiedad = 'Residencial' 
WHERE tipo_propiedad IS NULL;

-- Verificar los cambios
SHOW COLUMNS FROM usuarios_agua LIKE 'tipo_propiedad';

SELECT 'Campo tipo_propiedad agregado exitosamente' AS mensaje;
