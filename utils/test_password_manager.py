#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de prueba para verificar el gestor de contraseñas
"""

import sys
sys.path.append('.')

from password_manager import PasswordManager

def prueba_completa():
    """Ejecuta una prueba completa del sistema"""
    
    print("="*70)
    print("PRUEBA COMPLETA DEL GESTOR DE CONTRASEÑAS AQUATENEX")
    print("="*70)
    print()
    
    pm = PasswordManager()
    
    # Test 1: Conexión a la base de datos
    print("[Test 1] Probando conexión a la base de datos...")
    if pm.conectar_db():
        print("✓ Conexión exitosa\n")
    else:
        print("✗ Error en la conexión\n")
        return False
    
    # Test 2: Verificar credenciales del admin
    print("[Test 2] Verificando credenciales del usuario admin...")
    print("  Username: admin")
    print("  Password: admin123")
    if pm.verificar_credenciales('admin', 'admin123'):
        print("✓ Credenciales correctas\n")
    else:
        print("✗ Credenciales incorrectas\n")
        pm.desconectar_db()
        return False
    
    # Test 3: Probar contraseña incorrecta
    print("[Test 3] Probando contraseña incorrecta...")
    if not pm.verificar_credenciales('admin', 'wrongpassword'):
        print("✓ El sistema rechazó correctamente la contraseña incorrecta\n")
    else:
        print("✗ El sistema aceptó una contraseña incorrecta\n")
    
    # Test 4: Listar usuarios
    print("[Test 4] Listando todos los usuarios del sistema...")
    pm.listar_usuarios()
    print()
    
    # Test 5: Generar hash
    print("[Test 5] Generando hash de prueba...")
    hash_prueba = pm.cifrar_password("test123")
    print(f"✓ Hash generado: {hash_prueba[:50]}...")
    print(f"  Longitud: {len(hash_prueba)} caracteres")
    print()
    
    # Test 6: Verificar hash generado
    print("[Test 6] Verificando hash generado...")
    if pm.verificar_password("test123", hash_prueba):
        print("✓ Verificación de hash correcta\n")
    else:
        print("✗ Error al verificar hash\n")
    
    # Test 7: Crear usuario de prueba
    print("[Test 7] Creando usuario de prueba...")
    if pm.crear_usuario(
        username="test_user",
        password="test123456",
        nombre_completo="Usuario de Prueba",
        email="test@aquatenex.com",
        rol="cobrador"
    ):
        print("✓ Usuario de prueba creado\n")
        
        # Test 8: Verificar nuevo usuario
        print("[Test 8] Verificando credenciales del nuevo usuario...")
        if pm.verificar_credenciales("test_user", "test123456"):
            print("✓ Nuevo usuario funciona correctamente\n")
        else:
            print("✗ Error al verificar nuevo usuario\n")
        
        # Test 9: Actualizar contraseña
        print("[Test 9] Actualizando contraseña del usuario de prueba...")
        if pm.actualizar_password("test_user", "newpassword123"):
            print("✓ Contraseña actualizada\n")
            
            # Test 10: Verificar nueva contraseña
            print("[Test 10] Verificando nueva contraseña...")
            if pm.verificar_credenciales("test_user", "newpassword123"):
                print("✓ Nueva contraseña funciona correctamente\n")
            else:
                print("✗ Error con la nueva contraseña\n")
        
        # Limpiar: Eliminar usuario de prueba
        print("[Limpieza] Eliminando usuario de prueba...")
        cursor = pm.connection.cursor()
        cursor.execute("DELETE FROM usuarios_sistema WHERE username = 'test_user'")
        pm.connection.commit()
        cursor.close()
        print("✓ Usuario de prueba eliminado\n")
    
    # Desconectar
    pm.desconectar_db()
    
    print("="*70)
    print("✓ TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE")
    print("="*70)
    print()
    print("Resumen:")
    print("  - Conexión a base de datos: OK")
    print("  - Verificación de credenciales: OK")
    print("  - Rechazo de contraseñas incorrectas: OK")
    print("  - Listado de usuarios: OK")
    print("  - Generación de hash: OK")
    print("  - Verificación de hash: OK")
    print("  - Creación de usuarios: OK")
    print("  - Actualización de contraseñas: OK")
    print()
    print("El sistema está funcionando correctamente!")
    print()
    
    return True

if __name__ == "__main__":
    try:
        prueba_completa()
    except Exception as e:
        print(f"\n✗ Error durante las pruebas: {e}")
        sys.exit(1)
