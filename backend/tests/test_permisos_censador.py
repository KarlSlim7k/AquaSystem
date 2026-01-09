#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de prueba para verificar los permisos del usuario censador
"""

import requests
import json

# Configuración
BASE_URL = "http://localhost:8000/api"
CENSADOR_CREDENTIALS = {
    "username": "censador",
    "password": "censa123"
}

def print_separator(title=""):
    print("\n" + "="*70)
    if title:
        print(f"  {title}")
        print("="*70)

def test_login():
    """Prueba 1: Login del usuario censador"""
    print_separator("PRUEBA 1: Login Usuario Censador")
    
    response = requests.post(f"{BASE_URL}/login", json=CENSADOR_CREDENTIALS)
    
    if response.status_code == 200:
        data = response.json()
        print("✓ Login exitoso")
        print(f"  Usuario: {data['data']['usuario']['username']}")
        print(f"  Rol: {data['data']['usuario']['rol']}")
        print(f"  Token generado: {data['data']['token'][:50]}...")
        return data['data']['token']
    else:
        print(f"✗ Error en login: {response.status_code}")
        print(f"  {response.text}")
        return None

def test_me(token):
    """Prueba 2: Endpoint /me"""
    print_separator("PRUEBA 2: Endpoint /me")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/me", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print("✓ Datos del usuario obtenidos")
        print(f"  Nombre: {data['data']['nombre_completo']}")
        print(f"  Rol: {data['data']['rol']}")
    else:
        print(f"✗ Error: {response.status_code}")

def test_listar_usuarios(token):
    """Prueba 3: Listar usuarios (PERMITIDO)"""
    print_separator("PRUEBA 3: Listar Usuarios del Servicio (PERMITIDO)")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/usuarios-agua", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Acceso permitido - Status: {response.status_code}")
        print(f"  Total usuarios: {data.get('total', 'N/A')}")
    else:
        print(f"✗ Acceso denegado - Status: {response.status_code}")
        print(f"  {response.json().get('message', 'Error desconocido')}")

def test_crear_usuario(token):
    """Prueba 4: Crear usuario (PERMITIDO)"""
    print_separator("PRUEBA 4: Crear Usuario (PERMITIDO)")
    
    headers = {"Authorization": f"Bearer {token}"}
    nuevo_usuario = {
        "nombre_completo": "Usuario de Prueba Censador",
        "calle": "Calle Test",
        "colonia": "Colonia Test",
        "telefono": "2281234567"
    }
    
    response = requests.post(f"{BASE_URL}/usuarios-agua", json=nuevo_usuario, headers=headers)
    
    if response.status_code in [200, 201]:
        print(f"✓ Usuario creado - Status: {response.status_code}")
        data = response.json()
        if 'data' in data:
            print(f"  ID: {data['data'].get('id_usuario', 'N/A')}")
            print(f"  Número cuenta: {data['data'].get('numero_cuenta', 'N/A')}")
        return data.get('data', {}).get('id_usuario')
    else:
        print(f"✗ Error al crear - Status: {response.status_code}")
        print(f"  {response.json().get('message', 'Error desconocido')}")
        return None

def test_ver_usuario(token, user_id=1):
    """Prueba 5: Ver detalle de usuario (PERMITIDO)"""
    print_separator("PRUEBA 5: Ver Detalle de Usuario (PERMITIDO)")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/usuarios-agua/{user_id}", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Acceso permitido - Status: {response.status_code}")
        if 'data' in data:
            print(f"  Usuario: {data['data'].get('nombre_completo', 'N/A')}")
    else:
        print(f"✗ Acceso denegado - Status: {response.status_code}")

def test_dashboard(token):
    """Prueba 6: Dashboard (NO PERMITIDO)"""
    print_separator("PRUEBA 6: Dashboard/Estadísticas (NO PERMITIDO)")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/dashboard/estadisticas", headers=headers)
    
    if response.status_code == 403:
        print(f"✓ Acceso correctamente denegado - Status: {response.status_code}")
        data = response.json()
        print(f"  Mensaje: {data.get('message', 'N/A')}")
        print(f"  Tu rol: {data.get('your_role', 'N/A')}")
    elif response.status_code == 200:
        print(f"✗ ERROR: Acceso permitido cuando NO debería - Status: {response.status_code}")
    else:
        print(f"? Status inesperado: {response.status_code}")

def test_pagos(token):
    """Prueba 7: Listar pagos (NO PERMITIDO)"""
    print_separator("PRUEBA 7: Listar Pagos (NO PERMITIDO)")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/pagos", headers=headers)
    
    if response.status_code == 403:
        print(f"✓ Acceso correctamente denegado - Status: {response.status_code}")
        data = response.json()
        print(f"  Mensaje: {data.get('message', 'N/A')}")
    elif response.status_code == 200:
        print(f"✗ ERROR: Acceso permitido cuando NO debería - Status: {response.status_code}")
    else:
        print(f"? Status inesperado: {response.status_code}")

def test_mapa(token):
    """Prueba 8: Mapa de usuarios (NO PERMITIDO)"""
    print_separator("PRUEBA 8: Mapa de Usuarios (NO PERMITIDO)")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/dashboard/mapa-usuarios", headers=headers)
    
    if response.status_code == 403:
        print(f"✓ Acceso correctamente denegado - Status: {response.status_code}")
        data = response.json()
        print(f"  Mensaje: {data.get('message', 'N/A')}")
    elif response.status_code == 200:
        print(f"✗ ERROR: Acceso permitido cuando NO debería - Status: {response.status_code}")
    else:
        print(f"? Status inesperado: {response.status_code}")

def main():
    print("\n")
    print("╔" + "═"*68 + "╗")
    print("║" + " "*15 + "TEST PERMISOS USUARIO CENSADOR" + " "*23 + "║")
    print("╚" + "═"*68 + "╝")
    
    # Prueba 1: Login
    token = test_login()
    if not token:
        print("\n✗ No se pudo obtener token. Abortando pruebas.")
        return
    
    # Prueba 2: Endpoint /me
    test_me(token)
    
    # Prueba 3: Listar usuarios (PERMITIDO)
    test_listar_usuarios(token)
    
    # Prueba 4: Crear usuario (PERMITIDO)
    user_id = test_crear_usuario(token)
    
    # Prueba 5: Ver usuario (PERMITIDO)
    test_ver_usuario(token, user_id if user_id else 1)
    
    # Prueba 6: Dashboard (NO PERMITIDO)
    test_dashboard(token)
    
    # Prueba 7: Pagos (NO PERMITIDO)
    test_pagos(token)
    
    # Prueba 8: Mapa (NO PERMITIDO)
    test_mapa(token)
    
    # Resumen
    print_separator("RESUMEN")
    print("\n✓ Pruebas completadas")
    print("\nPermisos del usuario censador:")
    print("  ✓ Login")
    print("  ✓ Listar usuarios del servicio")
    print("  ✓ Ver detalle de usuarios")
    print("  ✓ Crear nuevos usuarios")
    print("  ✗ Acceso a dashboard/estadísticas")
    print("  ✗ Acceso a módulo de pagos")
    print("  ✗ Acceso a mapa de usuarios")
    print()

if __name__ == "__main__":
    try:
        main()
    except requests.exceptions.ConnectionError:
        print("\n✗ Error: No se pudo conectar al servidor")
        print("  Verifique que el backend esté corriendo en http://localhost:8000")
    except Exception as e:
        print(f"\n✗ Error inesperado: {e}")
