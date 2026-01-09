#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
============================================================
AQUATENEX - CREAR USUARIO CENSADOR
Script para crear el usuario tipo Censador en el sistema
============================================================
"""

import sys
import os

# Agregar el directorio scripts al path para importar password_manager
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'scripts'))

try:
    from password_manager import PasswordManager
except ImportError:
    print("✗ Error: No se pudo importar password_manager")
    print("Asegúrese de que el archivo password_manager.py existe en la carpeta 'scripts'")
    sys.exit(1)

def crear_censador():
    """Crea el usuario censador en el sistema"""
    
    print("="*70)
    print("  AQUATENEX - CREAR USUARIO CENSADOR")
    print("="*70)
    print()
    print("Este script creará el usuario 'censador' con las siguientes características:")
    print()
    print("  • Username:        censador")
    print("  • Password:        censa123")
    print("  • Nombre:          Usuario Censador")
    print("  • Email:           censador@aquatenex.com")
    print("  • Rol:             censador")
    print("  • Permisos:        Solo acceso a censo de usuarios")
    print()
    print("="*70)
    print()
    
    respuesta = input("¿Desea continuar con la creación del usuario? (S/N): ").strip().upper()
    
    if respuesta != 'S':
        print("\n✗ Operación cancelada por el usuario")
        return
    
    print("\n" + "-"*70)
    print("Iniciando creación del usuario censador...")
    print("-"*70)
    
    # Crear instancia del gestor de contraseñas
    pm = PasswordManager()
    
    # Conectar a la base de datos
    if not pm.conectar_db():
        print("\n✗ No se pudo conectar a la base de datos")
        print("Verifique que MySQL esté en ejecución y la configuración sea correcta")
        return
    
    # Datos del usuario censador
    username = "censador"
    password = "censa123"
    nombre_completo = "Usuario Censador"
    email = "censador@aquatenex.com"
    rol = "censador"
    
    # Crear el usuario
    exito = pm.crear_usuario(
        username=username,
        password=password,
        nombre_completo=nombre_completo,
        email=email,
        rol=rol
    )
    
    if exito:
        print("\n" + "="*70)
        print("  ✓ USUARIO CENSADOR CREADO EXITOSAMENTE")
        print("="*70)
        print()
        print("Credenciales de acceso:")
        print(f"  Username: {username}")
        print(f"  Password: {password}")
        print()
        print("Permisos asignados:")
        print("  ✓ Acceso al formulario de censo de nuevos usuarios")
        print("  ✓ Visualización de lista de usuarios del servicio")
        print("  ✗ Sin acceso a dashboard")
        print("  ✗ Sin acceso a módulo de pagos")
        print("  ✗ Sin acceso a mapa de usuarios")
        print("  ✗ Sin acceso a estadísticas")
        print()
        print("="*70)
        print()
        print("IMPORTANTE: Guarde estas credenciales en un lugar seguro")
        print()
    else:
        print("\n✗ Error al crear el usuario censador")
        print("Posibles causas:")
        print("  - El usuario 'censador' ya existe en la base de datos")
        print("  - Error de conexión a la base de datos")
        print("  - Problema con los permisos de la base de datos")
    
    # Desconectar
    pm.desconectar_db()
    print()

if __name__ == "__main__":
    try:
        crear_censador()
    except KeyboardInterrupt:
        print("\n\n✓ Operación cancelada por el usuario")
        sys.exit(0)
    except Exception as e:
        print(f"\n✗ Error inesperado: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
