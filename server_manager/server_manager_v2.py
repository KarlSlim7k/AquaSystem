#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Server Manager - Versión mejorada para Windows
Manejo optimizado de señales y procesos en Windows
"""

import subprocess
import os
import sys
import time
import atexit
from pathlib import Path
from threading import Thread, Event

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

class ServerProcess:
    """Clase para manejar un proceso de servidor"""
    def __init__(self, name, command, cwd, color):
        self.name = name
        self.command = command
        self.cwd = cwd
        self.color = color
        self.process = None
        self.thread = None
        self.stop_event = Event()
        
    def start(self):
        """Inicia el proceso del servidor"""
        try:
            print(f"{self.color}🚀 Iniciando {self.name}...{Colors.ENDC}")
            
            # Crear proceso sin compartir consola
            if sys.platform == 'win32':
                startupinfo = subprocess.STARTUPINFO()
                startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
                shell = 'npm' in self.command[0]
                
                self.process = subprocess.Popen(
                    self.command,
                    cwd=str(self.cwd),
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    text=True,
                    bufsize=1,
                    startupinfo=startupinfo,
                    shell=shell,
                    creationflags=subprocess.CREATE_NEW_PROCESS_GROUP
                )
            else:
                self.process = subprocess.Popen(
                    self.command,
                    cwd=str(self.cwd),
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    text=True,
                    bufsize=1
                )
            
            # Thread para leer salida
            self.thread = Thread(target=self._read_output, daemon=True)
            self.thread.start()
            
            time.sleep(1)
            if self.is_running():
                print(f"{Colors.OKGREEN}✅ {self.name} iniciado correctamente{Colors.ENDC}")
                return True
            else:
                print(f"{Colors.FAIL}❌ Error al iniciar {self.name}{Colors.ENDC}")
                return False
        except Exception as e:
            print(f"{Colors.FAIL}❌ Error al iniciar {self.name}: {str(e)}{Colors.ENDC}")
            return False
    
    def _read_output(self):
        """Lee la salida del proceso"""
        try:
            while not self.stop_event.is_set() and self.process:
                line = self.process.stdout.readline()
                if not line:
                    break
                print(f"{self.color}[{self.name}]{Colors.ENDC} {line.rstrip()}")
        except Exception:
            pass
    
    def stop(self):
        """Detiene el proceso del servidor"""
        if self.process and self.is_running():
            print(f"{Colors.WARNING}⏹️  Deteniendo {self.name}...{Colors.ENDC}")
            self.stop_event.set()
            
            try:
                if sys.platform == 'win32':
                    # Usar taskkill para matar el árbol de procesos
                    subprocess.run(
                        ['taskkill', '/F', '/T', '/PID', str(self.process.pid)],
                        stdout=subprocess.DEVNULL,
                        stderr=subprocess.DEVNULL,
                        timeout=5,
                        check=False
                    )
                else:
                    self.process.terminate()
                    self.process.wait(timeout=5)
                
                print(f"{Colors.OKGREEN}✅ {self.name} detenido{Colors.ENDC}")
            except Exception:
                try:
                    self.process.kill()
                    print(f"{Colors.WARNING}⚠️  {self.name} detenido forzadamente{Colors.ENDC}")
                except:
                    pass
    
    def is_running(self):
        """Verifica si el proceso está corriendo"""
        return self.process is not None and self.process.poll() is None

class ImprovedServerManager:
    def __init__(self):
        self.script_dir = Path(__file__).parent
        self.project_root = self.script_dir.parent
        self.backend_dir = self.project_root / 'backend'
        self.frontend_dir = self.project_root / 'frontend'
        
        self.backend = ServerProcess(
            "BACKEND",
            ['php', 'artisan', 'serve'],
            self.backend_dir,
            Colors.OKBLUE
        )
        
        self.frontend = ServerProcess(
            "FRONTEND",
            ['npm', 'run', 'dev'],
            self.frontend_dir,
            Colors.OKCYAN
        )
        
        # Registrar limpieza
        atexit.register(self.cleanup)
    
    def cleanup(self):
        """Limpia todos los procesos"""
        self.backend.stop()
        self.frontend.stop()
    
    def start_all(self):
        """Inicia ambos servidores"""
        print(f"\n{Colors.BOLD}{'='*50}{Colors.ENDC}")
        print(f"{Colors.BOLD}  Iniciando servidores AquaTenex{Colors.ENDC}")
        print(f"{Colors.BOLD}{'='*50}{Colors.ENDC}\n")
        
        backend_ok = self.backend.start()
        time.sleep(1)
        frontend_ok = self.frontend.start()
        
        if backend_ok and frontend_ok:
            print(f"\n{Colors.BOLD}{'='*50}{Colors.ENDC}")
            print(f"{Colors.OKGREEN}✅ Servidores iniciados correctamente{Colors.ENDC}")
            print(f"   Backend:  http://localhost:8000")
            print(f"   Frontend: http://localhost:5173")
            print(f"\n{Colors.WARNING}💡 Presiona Ctrl+C para detener los servidores{Colors.ENDC}")
            print(f"{Colors.BOLD}{'='*50}{Colors.ENDC}\n")
            return True
        else:
            print(f"\n{Colors.FAIL}❌ Error al iniciar los servidores{Colors.ENDC}")
            self.cleanup()
            return False
    
    def wait_for_exit(self):
        """Espera hasta que el usuario presione Ctrl+C"""
        try:
            while self.backend.is_running() or self.frontend.is_running():
                time.sleep(1)
        except KeyboardInterrupt:
            print(f"\n\n{Colors.WARNING}⚠️  Interrupción detectada (Ctrl+C){Colors.ENDC}")
            self.cleanup()
            print(f"\n{Colors.OKGREEN}✅ ¡Hasta luego!{Colors.ENDC}\n")

def main():
    """Función principal"""
    manager = ImprovedServerManager()
    
    if not manager.backend_dir.exists() or not manager.frontend_dir.exists():
        print(f"{Colors.FAIL}❌ Error: Directorios no encontrados{Colors.ENDC}")
        sys.exit(1)
    
    if manager.start_all():
        manager.wait_for_exit()
    else:
        sys.exit(1)

if __name__ == '__main__':
    main()
