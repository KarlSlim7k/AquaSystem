import bcrypt

# Generar hash para admin123
password = "admin123"
password_bytes = password.encode('utf-8')
salt = bcrypt.gensalt(rounds=12)
hashed = bcrypt.hashpw(password_bytes, salt)

print(f"Hash para '{password}':")
print(hashed.decode('utf-8'))
print()

# Verificar el hash que está en la BD
hash_bd = "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5KeYZIiOqKx6i"
print(f"Verificando hash de la BD...")
if bcrypt.checkpw(password_bytes, hash_bd.encode('utf-8')):
    print(f"✓ El hash en la BD SI corresponde a '{password}'")
else:
    print(f"✗ El hash en la BD NO corresponde a '{password}'")
    print()
    print("Probando otras contraseñas comunes...")
    for pwd in ["admin", "password", "123456", "Admin123"]:
        if bcrypt.checkpw(pwd.encode('utf-8'), hash_bd.encode('utf-8')):
            print(f"✓ El hash corresponde a: '{pwd}'")
            break
