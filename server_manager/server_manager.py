#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Server Manager - Gestor de Servidores Backend y Frontend
Permite iniciar, detener y administrar los servidores de desarrollo
"""

import subprocess
import os
import sys
import time
import signal
from pathlib import Path
from threading import Thread
import atexit

class Colors:
    """Códigos de color ANSI para terminal"""
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

class ServerManager:
    def __init__(self):
        # Obtener la ruta del proyecto (un nivel arriba del script)
        self.script_dir = Path(__file__).parent
        self.project_root = self.script_dir.parent
        self.backend_dir = self.project_root / 'backend'
        self.frontend_dir = self.project_root / 'frontend'
        
        # Procesos de los servidores
        self.backend_process = None
        self.frontend_process = None
        
        # Registrar limpieza al salir
        atexit.register(self.cleanup)
        
    def print_banner(self):
        """Imprime el banner del programa"""
        print(f"\n{Colors.HEADER}{Colors.BOLD}")
        print("╔════════════════════════════════════════════════╗")
        print("║      AquaTenex - Server Manager v1.0          ║")
        print("║      Gestor de Servidores de Desarrollo       ║")
        print("╚════════════════════════════════════════════════╝")
        print(f"{Colors.ENDC}\n")
        
    def check_directories(self):
        """Verifica que existan los directorios necesarios"""
        if not self.backend_dir.exists():
            print(f"{Colors.FAIL}❌ Error: No se encontró el directorio backend en {self.backend_dir}{Colors.ENDC}")
            return False
        if not self.frontend_dir.exists():
            print(f"{Colors.FAIL}❌ Error: No se encontró el directorio frontend en {self.frontend_dir}{Colors.ENDC}")
            return False
        return True
    
    def start_backend(self):
        """Inicia el servidor backend de Laravel"""
        print(f"{Colors.OKCYAN}🔧 Iniciando servidor backend (Laravel)...{Colors.ENDC}")
        try:
            # En Windows, usamos CREATE_NEW_PROCESS_GROUP para poder terminar el proceso correctamente
            creationflags = subprocess.CREATE_NEW_PROCESS_GROUP if sys.platform == 'win32' else 0
            
            self.backend_process = subprocess.Popen(
                ['php', 'artisan', 'serve'],
                cwd=str(self.backend_dir),
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                creationflags=creationflags
            )
            
            # Thread para leer la salida del backend
            Thread(target=self.read_output, args=(self.backend_process, "BACKEND"), daemon=True).start()
            
            time.sleep(2)
            if self.backend_process.poll() is None:
                print(f"{Colors.OKGREEN}✅ Servidor backend iniciado en http://localhost:8000{Colors.ENDC}")
                return True
            else:
                print(f"{Colors.FAIL}❌ Error al iniciar el servidor backend{Colors.ENDC}")
                return False
        except Exception as e:
            print(f"{Colors.FAIL}❌ Error al iniciar backend: {str(e)}{Colors.ENDC}")
            return False
    
    def start_frontend(self):
        """Inicia el servidor frontend de Vite"""
        print(f"{Colors.OKCYAN}🔧 Iniciando servidor frontend (Vite)...{Colors.ENDC}")
        try:
            # En Windows, usamos CREATE_NEW_PROCESS_GROUP para poder terminar el proceso correctamente
            creationflags = subprocess.CREATE_NEW_PROCESS_GROUP if sys.platform == 'win32' else 0
            
            self.frontend_process = subprocess.Popen(
                ['npm', 'run', 'dev'],
                cwd=str(self.frontend_dir),
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                creationflags=creationflags,
                shell=True  # Necesario en Windows para npm
            )
            
            # Thread para leer la salida del frontend
            Thread(target=self.read_output, args=(self.frontend_process, "FRONTEND"), daemon=True).start()
            
            time.sleep(3)
            if self.frontend_process.poll() is None:
                print(f"{Colors.OKGREEN}✅ Servidor frontend iniciado (generalmente en http://localhost:5173){Colors.ENDC}")
                return True
            else:
                print(f"{Colors.FAIL}❌ Error al iniciar el servidor frontend{Colors.ENDC}")
                return False
        except Exception as e:
            print(f"{Colors.FAIL}❌ Error al iniciar frontend: {str(e)}{Colors.ENDC}")
            return False
    
    def read_output(self, process, server_name):
        """Lee y muestra la salida de un proceso"""
        prefix_colors = {
            "BACKEND": Colors.OKBLUE,
            "FRONTEND": Colors.OKCYAN
        }
        color = prefix_colors.get(server_name, Colors.ENDC)
        
        try:
            for line in iter(process.stdout.readline, ''):
                if line:
                    print(f"{color}[{server_name}]{Colors.ENDC} {line.rstrip()}")
        except Exception:
            pass
    
    def stop_backend(self):
        """Detiene el servidor backend"""
        if self.backend_process and self.backend_process.poll() is None:
            print(f"{Colors.WARNING}⏹️  Deteniendo servidor backend...{Colors.ENDC}")
            try:
                if sys.platform == 'win32':
                    # En Windows, matar el árbol de procesos completo
                    subprocess.run(
                        ['taskkill', '/F', '/T', '/PID', str(self.backend_process.pid)],
                        stdout=subprocess.DEVNULL,
                        stderr=subprocess.DEVNULL,
                        timeout=5
                    )
                else:
                    self.backend_process.terminate()
                    self.backend_process.wait(timeout=5)
                print(f"{Colors.OKGREEN}✅ Servidor backend detenido{Colors.ENDC}")
            except Exception as e:
                print(f"{Colors.WARNING}⚠️  Forzando cierre del backend...{Colors.ENDC}")
                try:
                    self.backend_process.kill()
                except:
                    pass
    
    def stop_frontend(self):
        """Detiene el servidor frontend"""
        if self.frontend_process and self.frontend_process.poll() is None:
            print(f"{Colors.WARNING}⏹️  Deteniendo servidor frontend...{Colors.ENDC}")
            try:
                if sys.platform == 'win32':
                    # En Windows, matar el árbol de procesos completo
                    subprocess.run(
                        ['taskkill', '/F', '/T', '/PID', str(self.frontend_process.pid)],
                        stdout=subprocess.DEVNULL,
                        stderr=subprocess.DEVNULL,
                        timeout=5
                    )
                else:
                    self.frontend_process.terminate()
                    self.frontend_process.wait(timeout=5)
                print(f"{Colors.OKGREEN}✅ Servidor frontend detenido{Colors.ENDC}")
            except Exception as e:
                print(f"{Colors.WARNING}⚠️  Forzando cierre del frontend...{Colors.ENDC}")
                try:
                    self.frontend_process.kill()
                except:
                    pass
    
    def cleanup(self):
        """Limpieza al salir del programa"""
        self.stop_backend()
        self.stop_frontend()
    
    def check_status(self):
        """Verifica el estado de los servidores"""
        print(f"\n{Colors.BOLD}📊 Estado de los servidores:{Colors.ENDC}")
        
        backend_status = "🟢 Activo" if self.backend_process and self.backend_process.poll() is None else "🔴 Inactivo"
        frontend_status = "🟢 Activo" if self.frontend_process and self.frontend_process.poll() is None else "🔴 Inactivo"
        
        print(f"  Backend (Laravel):  {backend_status}")
        print(f"  Frontend (Vite):    {frontend_status}\n")
    
    def show_menu(self):
        """Muestra el menú principal"""
        print(f"\n{Colors.BOLD}═══════════════ MENÚ ═══════════════{Colors.ENDC}")
        print("1. 🚀 Iniciar ambos servidores")
        print("2. ⏹️  Detener ambos servidores")
        print("3. 🔧 Iniciar solo backend")
        print("4. 🔧 Iniciar solo frontend")
        print("5. ⏹️  Detener solo backend")
        print("6. ⏹️  Detener solo frontend")
        print("7. 📊 Ver estado de los servidores")
        print("8. 🔄 Reiniciar ambos servidores")
        print("9. ❌ Salir")
        print(f"{Colors.BOLD}════════════════════════════════════{Colors.ENDC}\n")
    
    def run(self):
        """Ejecuta el programa principal"""
        self.print_banner()
        
        if not self.check_directories():
            print(f"\n{Colors.FAIL}No se puede continuar. Verifica la estructura del proyecto.{Colors.ENDC}")
            sys.exit(1)
        
        print(f"{Colors.OKGREEN}✅ Directorios verificados correctamente{Colors.ENDC}")
        print(f"   Backend:  {self.backend_dir}")
        print(f"   Frontend: {self.frontend_dir}")
        
        try:
            while True:
                self.show_menu()
                choice = input(f"{Colors.BOLD}Selecciona una opción: {Colors.ENDC}").strip()
                
                if choice == '1':
                    self.start_backend()
                    self.start_frontend()
                elif choice == '2':
                    self.stop_backend()
                    self.stop_frontend()
                elif choice == '3':
                    self.start_backend()
                elif choice == '4':
                    self.start_frontend()
                elif choice == '5':
                    self.stop_backend()
                elif choice == '6':
                    self.stop_frontend()
                elif choice == '7':
                    self.check_status()
                elif choice == '8':
                    print(f"{Colors.WARNING}🔄 Reiniciando servidores...{Colors.ENDC}")
                    self.stop_backend()
                    self.stop_frontend()
                    time.sleep(2)
                    self.start_backend()
                    self.start_frontend()
                elif choice == '9':
                    print(f"\n{Colors.WARNING}👋 Cerrando Server Manager...{Colors.ENDC}")
                    self.cleanup()
                    print(f"{Colors.OKGREEN}✅ ¡Hasta luego!{Colors.ENDC}\n")
                    sys.exit(0)
                else:
                    print(f"{Colors.FAIL}❌ Opción inválida. Intenta de nuevo.{Colors.ENDC}")
                
        except KeyboardInterrupt:
            print(f"\n\n{Colors.WARNING}⚠️  Interrupción detectada (Ctrl+C){Colors.ENDC}")
            self.cleanup()
            print(f"{Colors.OKGREEN}✅ Servidores detenidos. ¡Hasta luego!{Colors.ENDC}\n")
            sys.exit(0)

if __name__ == '__main__':
    manager = ServerManager()
    manager.run()
