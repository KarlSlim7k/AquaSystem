-- Actualizar contraseña del usuario censador con hash compatible con Laravel
UPDATE usuarios_sistema 
SET password_hash = '$2y$10$RqOPpoPn76bneRAliT.yuuJPO.OKxPQSCNXi8pcXjZHx7TiYDi/Se'
WHERE username = 'censador';
