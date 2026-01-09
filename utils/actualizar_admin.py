#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para actualizar la contraseña del admin
"""

import sys
sys.path.append('.')

from password_manager import PasswordManager

def actualizar_admin():
    """Actualiza la contraseña del admin a admin123"""
    
    print("="*70)
    print("ACTUALIZANDO CONTRASEÑA DEL ADMINISTRADOR")
    print("="*70)
    print()
    
    pm = PasswordManager()
    
    if not pm.conectar_db():
        print("✗ Error al conectar a la base de datos")
        return False
    
    print("Actualizando contraseña del usuario 'admin' a 'admin123'...")
    
    if pm.actualizar_password('admin', 'admin123'):
        print()
        print("✓ Contraseña actualizada exitosamente!")
        print()
        print("Verificando las nuevas credenciales...")
        if pm.verificar_credenciales('admin', 'admin123'):
            print()
            print("="*70)
            print("✓ TODO CORRECTO!")
            print("="*70)
            print()
            print("Puedes usar estas credenciales:")
            print("  Username: admin")
            print("  Password: admin123")
            print()
        else:
            print("✗ Error al verificar las nuevas credenciales")
    else:
        print("✗ Error al actualizar la contraseña")
    
    pm.desconectar_db()

if __name__ == "__main__":
    try:
        actualizar_admin()
    except Exception as e:
        print(f"\n✗ Error: {e}")
        sys.exit(1)
