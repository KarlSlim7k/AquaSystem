#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para verificar si el usuario censador existe en la base de datos
"""

import sys
import os
import mysql.connector
from mysql.connector import Error

# Configuración de la base de datos
DB_CONFIG = {
    'host': 'localhost',
    'database': 'aquatenex_db',
    'user': 'root',
    'password': ''
}

def verificar_censador():
    """Verifica si existe el usuario censador en la BD"""
    
    try:
        # Conectar a la base de datos
        connection = mysql.connector.connect(**DB_CONFIG)
        
        if connection.is_connected():
            print("✓ Conexión exitosa a la base de datos\n")
            
            cursor = connection.cursor()
            
            # Consultar el usuario censador
            query = """
                SELECT 
                    id_usuario_sistema,
                    username,
                    nombre_completo,
                    email,
                    rol,
                    activo,
                    bloqueado,
                    DATE_FORMAT(fecha_creacion, '%d/%m/%Y %H:%i:%s') as fecha_creacion,
                    DATE_FORMAT(ultimo_acceso, '%d/%m/%Y %H:%i:%s') as ultimo_acceso
                FROM usuarios_sistema
                WHERE username = 'censador'
            """
            
            cursor.execute(query)
            resultado = cursor.fetchone()
            
            if resultado:
                print("="*70)
                print("  USUARIO CENSADOR ENCONTRADO EN LA BASE DE DATOS")
                print("="*70)
                print()
                print(f"ID:                {resultado[0]}")
                print(f"Username:          {resultado[1]}")
                print(f"Nombre Completo:   {resultado[2]}")
                print(f"Email:             {resultado[3]}")
                print(f"Rol:               {resultado[4]}")
                print(f"Activo:            {'Sí' if resultado[5] else 'No'}")
                print(f"Bloqueado:         {'Sí' if resultado[6] else 'No'}")
                print(f"Fecha Creación:    {resultado[7]}")
                print(f"Último Acceso:     {resultado[8] if resultado[8] else 'Nunca'}")
                print()
                print("="*70)
                print("✓ El usuario censador está correctamente registrado")
                print("="*70)
            else:
                print("="*70)
                print("  ✗ USUARIO CENSADOR NO ENCONTRADO")
                print("="*70)
                print()
                print("El usuario 'censador' NO existe en la base de datos.")
                print("Ejecute el script 'crear_usuario_censador.py' para crearlo.")
                print()
            
            cursor.close()
            connection.close()
            print("\n✓ Conexión cerrada")
            
    except Error as e:
        print(f"✗ Error al conectar a la base de datos: {e}")
        print("\nVerifique que:")
        print("  - MySQL esté en ejecución")
        print("  - La base de datos 'aquatenex_db' exista")
        print("  - Las credenciales de conexión sean correctas")
        sys.exit(1)

if __name__ == "__main__":
    verificar_censador()
