#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
============================================================
AQUATENEX - GESTOR DE CONTRASEÑAS
Sistema de cifrado/descifrado de credenciales con bcrypt
============================================================
NOTA DE SEGURIDAD: Este programa es SOLO para uso interno
de administradores. Mantener en ubicación segura.
============================================================
"""

import bcrypt
import mysql.connector
from mysql.connector import Error
import getpass
import sys
from datetime import datetime
import os

# Configuración de la base de datos
DB_CONFIG = {
    'host': 'localhost',
    'database': 'aquatenex_db',
    'user': 'root',  # Cambiar según tu configuración
    'password': ''   # Cambiar según tu configuración
}

class PasswordManager:
    """Gestor de contraseñas con bcrypt para AquaTenex"""
    
    def __init__(self):
        self.connection = None
        
    def conectar_db(self):
        """Establece conexión con la base de datos"""
        try:
            self.connection = mysql.connector.connect(**DB_CONFIG)
            if self.connection.is_connected():
                print("✓ Conexión exitosa a la base de datos")
                return True
        except Error as e:
            print(f"✗ Error al conectar a la base de datos: {e}")
            return False
    
    def desconectar_db(self):
        """Cierra la conexión con la base de datos"""
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("✓ Conexión cerrada")
    
    def cifrar_password(self, password):
        """
        Cifra una contraseña usando bcrypt
        
        Args:
            password (str): Contraseña en texto plano
            
        Returns:
            str: Hash bcrypt de la contraseña
        """
        # Convertir a bytes
        password_bytes = password.encode('utf-8')
        
        # Generar salt y hash
        salt = bcrypt.gensalt(rounds=12)  # 12 rondas es un buen balance
        hashed = bcrypt.hashpw(password_bytes, salt)
        
        # Retornar como string
        return hashed.decode('utf-8')
    
    def verificar_password(self, password, hash_almacenado):
        """
        Verifica si una contraseña coincide con su hash
        
        Args:
            password (str): Contraseña en texto plano
            hash_almacenado (str): Hash bcrypt almacenado
            
        Returns:
            bool: True si coincide, False si no
        """
        password_bytes = password.encode('utf-8')
        hash_bytes = hash_almacenado.encode('utf-8')
        
        return bcrypt.checkpw(password_bytes, hash_bytes)
    
    def crear_usuario(self, username, password, nombre_completo, email, rol):
        """
        Crea un nuevo usuario en la base de datos con contraseña cifrada
        
        Args:
            username (str): Nombre de usuario
            password (str): Contraseña en texto plano
            nombre_completo (str): Nombre completo
            email (str): Correo electrónico
            rol (str): Rol del usuario (administrador, cobrador, consulta)
        """
        if not self.connection or not self.connection.is_connected():
            print("✗ No hay conexión a la base de datos")
            return False
        
        try:
            cursor = self.connection.cursor()
            
            # Cifrar contraseña
            password_hash = self.cifrar_password(password)
            
            # Insertar usuario
            query = """
                INSERT INTO usuarios_sistema 
                (username, password_hash, nombre_completo, email, rol, activo)
                VALUES (%s, %s, %s, %s, %s, TRUE)
            """
            
            cursor.execute(query, (username, password_hash, nombre_completo, email, rol))
            self.connection.commit()
            
            print(f"\n✓ Usuario '{username}' creado exitosamente")
            print(f"  - Nombre: {nombre_completo}")
            print(f"  - Email: {email}")
            print(f"  - Rol: {rol}")
            print(f"  - Hash generado: {password_hash[:50]}...")
            
            cursor.close()
            return True
            
        except Error as e:
            print(f"\n✗ Error al crear usuario: {e}")
            return False
    
    def actualizar_password(self, username, nueva_password):
        """
        Actualiza la contraseña de un usuario existente
        
        Args:
            username (str): Nombre de usuario
            nueva_password (str): Nueva contraseña en texto plano
        """
        if not self.connection or not self.connection.is_connected():
            print("✗ No hay conexión a la base de datos")
            return False
        
        try:
            cursor = self.connection.cursor()
            
            # Verificar que el usuario existe
            cursor.execute("SELECT id_usuario_sistema FROM usuarios_sistema WHERE username = %s", (username,))
            resultado = cursor.fetchone()
            
            if not resultado:
                print(f"✗ Usuario '{username}' no encontrado")
                cursor.close()
                return False
            
            # Cifrar nueva contraseña
            password_hash = self.cifrar_password(nueva_password)
            
            # Actualizar contraseña
            query = """
                UPDATE usuarios_sistema 
                SET password_hash = %s, 
                    intentos_fallidos = 0,
                    bloqueado = FALSE,
                    fecha_actualizacion = NOW()
                WHERE username = %s
            """
            
            cursor.execute(query, (password_hash, username))
            self.connection.commit()
            
            print(f"\n✓ Contraseña actualizada para '{username}'")
            print(f"  - Nuevo hash: {password_hash[:50]}...")
            
            cursor.close()
            return True
            
        except Error as e:
            print(f"\n✗ Error al actualizar contraseña: {e}")
            return False
    
    def verificar_credenciales(self, username, password):
        """
        Verifica las credenciales de un usuario
        
        Args:
            username (str): Nombre de usuario
            password (str): Contraseña en texto plano
        """
        if not self.connection or not self.connection.is_connected():
            print("✗ No hay conexión a la base de datos")
            return False
        
        try:
            cursor = self.connection.cursor()
            
            # Obtener hash almacenado
            query = """
                SELECT password_hash, nombre_completo, rol, activo, bloqueado
                FROM usuarios_sistema 
                WHERE username = %s
            """
            
            cursor.execute(query, (username,))
            resultado = cursor.fetchone()
            
            if not resultado:
                print(f"✗ Usuario '{username}' no encontrado")
                cursor.close()
                return False
            
            password_hash, nombre, rol, activo, bloqueado = resultado
            
            # Verificar estado del usuario
            if not activo:
                print(f"✗ Usuario '{username}' está inactivo")
                cursor.close()
                return False
            
            if bloqueado:
                print(f"✗ Usuario '{username}' está bloqueado")
                cursor.close()
                return False
            
            # Verificar contraseña
            if self.verificar_password(password, password_hash):
                print(f"\n✓ Credenciales correctas")
                print(f"  - Usuario: {username}")
                print(f"  - Nombre: {nombre}")
                print(f"  - Rol: {rol}")
                cursor.close()
                return True
            else:
                print(f"✗ Contraseña incorrecta para '{username}'")
                cursor.close()
                return False
            
        except Error as e:
            print(f"\n✗ Error al verificar credenciales: {e}")
            return False
    
    def listar_usuarios(self):
        """Lista todos los usuarios del sistema"""
        if not self.connection or not self.connection.is_connected():
            print("✗ No hay conexión a la base de datos")
            return False
        
        try:
            cursor = self.connection.cursor()
            
            query = """
                SELECT 
                    username, 
                    nombre_completo, 
                    email, 
                    rol, 
                    activo,
                    bloqueado,
                    DATE_FORMAT(ultimo_acceso, '%d/%m/%Y %H:%i') as ultimo_acceso
                FROM usuarios_sistema
                ORDER BY nombre_completo
            """
            
            cursor.execute(query)
            usuarios = cursor.fetchall()
            
            if not usuarios:
                print("\nNo hay usuarios registrados")
                cursor.close()
                return False
            
            print("\n" + "="*100)
            print("LISTA DE USUARIOS DEL SISTEMA")
            print("="*100)
            print(f"{'Username':<20} {'Nombre':<30} {'Email':<30} {'Rol':<15} {'Estado':<10}")
            print("-"*100)
            
            for usuario in usuarios:
                username, nombre, email, rol, activo, bloqueado, ultimo_acceso = usuario
                
                if bloqueado:
                    estado = "BLOQUEADO"
                elif not activo:
                    estado = "INACTIVO"
                else:
                    estado = "ACTIVO"
                
                email = email if email else "N/A"
                print(f"{username:<20} {nombre:<30} {email:<30} {rol:<15} {estado:<10}")
            
            print("="*100)
            print(f"Total: {len(usuarios)} usuarios")
            
            cursor.close()
            return True
            
        except Error as e:
            print(f"\n✗ Error al listar usuarios: {e}")
            return False


def menu_principal():
    """Muestra el menú principal del programa"""
    while True:
        print("\n" + "="*60)
        print("      AQUATENEX - GESTOR DE CONTRASEÑAS")
        print("="*60)
        print("1. Crear nuevo usuario")
        print("2. Actualizar contraseña de usuario existente")
        print("3. Verificar credenciales")
        print("4. Generar hash de contraseña (solo ver)")
        print("5. Listar usuarios del sistema")
        print("6. Salir")
        print("="*60)
        
        opcion = input("\nSeleccione una opción [1-6]: ").strip()
        
        if opcion == "1":
            crear_usuario_menu()
        elif opcion == "2":
            actualizar_password_menu()
        elif opcion == "3":
            verificar_credenciales_menu()
        elif opcion == "4":
            generar_hash_menu()
        elif opcion == "5":
            listar_usuarios_menu()
        elif opcion == "6":
            print("\n¡Hasta luego!")
            break
        else:
            print("\n✗ Opción no válida")


def crear_usuario_menu():
    """Menú para crear un nuevo usuario"""
    print("\n" + "-"*60)
    print("CREAR NUEVO USUARIO")
    print("-"*60)
    
    username = input("Username: ").strip()
    if not username:
        print("✗ Username no puede estar vacío")
        return
    
    nombre_completo = input("Nombre completo: ").strip()
    if not nombre_completo:
        print("✗ Nombre completo no puede estar vacío")
        return
    
    email = input("Email (opcional): ").strip()
    
    print("\nRoles disponibles:")
    print("  1. administrador")
    print("  2. gestor_campo")
    print("  3. cobrador")
    print("  4. censador")
    print("  5. supervisor")
    print("  6. contador")
    print("  7. soporte_tecnico")
    print("  8. consulta")
    rol_opcion = input("Seleccione rol [1-8]: ").strip()
    
    roles = {
        "1": "administrador",
        "2": "gestor_campo",
        "3": "cobrador",
        "4": "censador",
        "5": "supervisor",
        "6": "contador",
        "7": "soporte_tecnico",
        "8": "consulta"
    }
    
    rol = roles.get(rol_opcion)
    if not rol:
        print("✗ Rol no válido")
        return
    
    password = getpass.getpass("Contraseña: ")
    password_confirm = getpass.getpass("Confirmar contraseña: ")
    
    if password != password_confirm:
        print("✗ Las contraseñas no coinciden")
        return
    
    if len(password) < 6:
        print("✗ La contraseña debe tener al menos 6 caracteres")
        return
    
    # Crear usuario
    pm = PasswordManager()
    if pm.conectar_db():
        pm.crear_usuario(username, password, nombre_completo, email, rol)
        pm.desconectar_db()


def actualizar_password_menu():
    """Menú para actualizar contraseña"""
    print("\n" + "-"*60)
    print("ACTUALIZAR CONTRASEÑA")
    print("-"*60)
    
    username = input("Username del usuario: ").strip()
    if not username:
        print("✗ Username no puede estar vacío")
        return
    
    nueva_password = getpass.getpass("Nueva contraseña: ")
    password_confirm = getpass.getpass("Confirmar nueva contraseña: ")
    
    if nueva_password != password_confirm:
        print("✗ Las contraseñas no coinciden")
        return
    
    if len(nueva_password) < 6:
        print("✗ La contraseña debe tener al menos 6 caracteres")
        return
    
    # Actualizar contraseña
    pm = PasswordManager()
    if pm.conectar_db():
        pm.actualizar_password(username, nueva_password)
        pm.desconectar_db()


def verificar_credenciales_menu():
    """Menú para verificar credenciales"""
    print("\n" + "-"*60)
    print("VERIFICAR CREDENCIALES")
    print("-"*60)
    
    username = input("Username: ").strip()
    password = getpass.getpass("Contraseña: ")
    
    # Verificar credenciales
    pm = PasswordManager()
    if pm.conectar_db():
        pm.verificar_credenciales(username, password)
        pm.desconectar_db()


def generar_hash_menu():
    """Menú para generar hash de contraseña (solo visualizar)"""
    print("\n" + "-"*60)
    print("GENERAR HASH DE CONTRASEÑA")
    print("-"*60)
    print("NOTA: Este hash NO se guarda en la base de datos")
    print("-"*60)
    
    password = getpass.getpass("Contraseña a cifrar: ")
    
    if len(password) < 6:
        print("✗ La contraseña debe tener al menos 6 caracteres")
        return
    
    pm = PasswordManager()
    hash_generado = pm.cifrar_password(password)
    
    print(f"\n✓ Hash generado:")
    print(f"  {hash_generado}")
    print(f"\nLongitud: {len(hash_generado)} caracteres")


def listar_usuarios_menu():
    """Menú para listar usuarios"""
    pm = PasswordManager()
    if pm.conectar_db():
        pm.listar_usuarios()
        pm.desconectar_db()


if __name__ == "__main__":
    print("""
    ============================================================
    AQUATENEX - GESTOR DE CONTRASEÑAS
    Sistema de cifrado/descifrado con bcrypt
    ============================================================
    ADVERTENCIA: Este programa es SOLO para uso de 
    administradores autorizados del sistema.
    ============================================================
    """)
    
    # Verificar que bcrypt esté instalado
    try:
        import bcrypt
    except ImportError:
        print("✗ Error: bcrypt no está instalado")
        print("\nPara instalar bcrypt, ejecute:")
        print("  pip install bcrypt")
        sys.exit(1)
    
    # Verificar que mysql-connector esté instalado
    try:
        import mysql.connector
    except ImportError:
        print("✗ Error: mysql-connector-python no está instalado")
        print("\nPara instalar mysql-connector, ejecute:")
        print("  pip install mysql-connector-python")
        sys.exit(1)
    
    try:
        menu_principal()
    except KeyboardInterrupt:
        print("\n\n✓ Programa interrumpido por el usuario")
        sys.exit(0)
    except Exception as e:
        print(f"\n✗ Error inesperado: {e}")
        sys.exit(1)
