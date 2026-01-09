USE aquatenex_db;
UPDATE usuarios_sistema 
SET password_hash = '$2y$10$/MaPWbvWBkDjTpL4cF7Xdu2gmuqZEPlwDZtAF/29bG69kwiNG9KHu' 
WHERE username = 'admin';
SELECT username, LEFT(password_hash, 10) as hash_start FROM usuarios_sistema WHERE username = 'admin';
