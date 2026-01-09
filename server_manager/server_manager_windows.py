#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Server Manager - Ventanas Separadas
Inicia los servidores en ventanas de PowerShell independientes
"""

import subprocess
import sys
import time
import psutil
from pathlib import Path

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

class SeparateWindowsManager:
    def __init__(self):
        self.script_dir = Path(__file__).parent
        self.project_root = self.script_dir.parent
        self.backend_dir = self.project_root / 'backend'
        self.frontend_dir = self.project_root / 'frontend'
        
        self.backend_pid = None
        self.frontend_pid = None
        
    def print_banner(self):
        """Imprime el banner del programa"""
        print(f"\n{Colors.HEADER}{Colors.BOLD}")
        print("╔════════════════════════════════════════════════╗")
        print("║   AquaTenex - Server Manager (Ventanas)       ║")
        print("║         Gestión con Ventanas Separadas        ║")
        print("╚════════════════════════════════════════════════╝")
        print(f"{Colors.ENDC}\n")
    
    def check_directories(self):
        """Verifica que existan los directorios necesarios"""
        if not self.backend_dir.exists():
            print(f"{Colors.FAIL}❌ Error: No se encontró el directorio backend{Colors.ENDC}")
            return False
        if not self.frontend_dir.exists():
            print(f"{Colors.FAIL}❌ Error: No se encontró el directorio frontend{Colors.ENDC}")
            return False
        return True
    
    def start_backend(self):
        """Inicia el servidor backend en una ventana separada"""
        print(f"{Colors.OKCYAN}🔧 Iniciando servidor backend en nueva ventana...{Colors.ENDC}")
        try:
            # Crear comando PowerShell para backend
            ps_command = f'''
$Host.UI.RawUI.WindowTitle = "AquaTenex - Backend (Laravel)"
Write-Host ""
Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║      AquaTenex - Backend Server (Laravel)     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Directorio: {self.backend_dir}" -ForegroundColor Gray
Write-Host "🌐 URL: http://localhost:8000" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""
Write-Host "{'='*50}" -ForegroundColor Gray
Write-Host ""

Set-Location "{self.backend_dir}"
php artisan serve

Write-Host ""
Write-Host "⏹️  Servidor detenido. Presiona cualquier tecla para cerrar..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
'''
            
            # Iniciar PowerShell en nueva ventana
            process = subprocess.Popen(
                ['powershell', '-NoExit', '-Command', ps_command],
                creationflags=subprocess.CREATE_NEW_CONSOLE
            )
            
            self.backend_pid = process.pid
            time.sleep(2)
            
            # Verificar que el proceso esté corriendo
            if psutil.pid_exists(self.backend_pid):
                print(f"{Colors.OKGREEN}✅ Backend iniciado en nueva ventana (PID: {self.backend_pid}){Colors.ENDC}")
                print(f"   URL: http://localhost:8000")
                return True
            else:
                print(f"{Colors.FAIL}❌ Error al iniciar backend{Colors.ENDC}")
                return False
                
        except Exception as e:
            print(f"{Colors.FAIL}❌ Error: {str(e)}{Colors.ENDC}")
            return False
    
    def start_frontend(self):
        """Inicia el servidor frontend en una ventana separada"""
        print(f"{Colors.OKCYAN}🔧 Iniciando servidor frontend en nueva ventana...{Colors.ENDC}")
        try:
            # Crear comando PowerShell para frontend
            ps_command = f'''
$Host.UI.RawUI.WindowTitle = "AquaTenex - Frontend (Vite)"
Write-Host ""
Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║      AquaTenex - Frontend Server (Vite)       ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""
Write-Host "📍 Directorio: {self.frontend_dir}" -ForegroundColor Gray
Write-Host "🌐 URL: http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""
Write-Host "{'='*50}" -ForegroundColor Gray
Write-Host ""

Set-Location "{self.frontend_dir}"
npm run dev

Write-Host ""
Write-Host "⏹️  Servidor detenido. Presiona cualquier tecla para cerrar..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
'''
            
            # Iniciar PowerShell en nueva ventana
            process = subprocess.Popen(
                ['powershell', '-NoExit', '-Command', ps_command],
                creationflags=subprocess.CREATE_NEW_CONSOLE
            )
            
            self.frontend_pid = process.pid
            time.sleep(2)
            
            # Verificar que el proceso esté corriendo
            if psutil.pid_exists(self.frontend_pid):
                print(f"{Colors.OKGREEN}✅ Frontend iniciado en nueva ventana (PID: {self.frontend_pid}){Colors.ENDC}")
                print(f"   URL: http://localhost:5173")
                return True
            else:
                print(f"{Colors.FAIL}❌ Error al iniciar frontend{Colors.ENDC}")
                return False
                
        except Exception as e:
            print(f"{Colors.FAIL}❌ Error: {str(e)}{Colors.ENDC}")
            return False
    
    def check_servers_status(self):
        """Verifica el estado de los servidores"""
        print(f"\n{Colors.BOLD}📊 Estado de los servidores:{Colors.ENDC}\n")
        
        # Verificar backend
        backend_running = False
        if self.backend_pid and psutil.pid_exists(self.backend_pid):
            try:
                proc = psutil.Process(self.backend_pid)
                if proc.status() != psutil.STATUS_ZOMBIE:
                    backend_running = True
            except:
                pass
        
        # Verificar frontend
        frontend_running = False
        if self.frontend_pid and psutil.pid_exists(self.frontend_pid):
            try:
                proc = psutil.Process(self.frontend_pid)
                if proc.status() != psutil.STATUS_ZOMBIE:
                    frontend_running = True
            except:
                pass
        
        # Mostrar estado
        backend_status = f"{Colors.OKGREEN}🟢 Activo (PID: {self.backend_pid}){Colors.ENDC}" if backend_running else f"{Colors.FAIL}🔴 Inactivo{Colors.ENDC}"
        frontend_status = f"{Colors.OKGREEN}🟢 Activo (PID: {self.frontend_pid}){Colors.ENDC}" if frontend_running else f"{Colors.FAIL}🔴 Inactivo{Colors.ENDC}"
        
        print(f"  Backend (Laravel):  {backend_status}")
        print(f"  Frontend (Vite):    {frontend_status}")
        print()
        
        return backend_running, frontend_running
    
    def stop_server(self, pid, name):
        """Detiene un servidor específico"""
        if pid and psutil.pid_exists(pid):
            try:
                print(f"{Colors.WARNING}⏹️  Deteniendo {name}...{Colors.ENDC}")
                # Matar el árbol de procesos
                subprocess.run(
                    ['taskkill', '/F', '/T', '/PID', str(pid)],
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                    check=False
                )
                time.sleep(1)
                print(f"{Colors.OKGREEN}✅ {name} detenido{Colors.ENDC}")
            except Exception as e:
                print(f"{Colors.FAIL}❌ Error al detener {name}: {str(e)}{Colors.ENDC}")
        else:
            print(f"{Colors.WARNING}⚠️  {name} no está corriendo{Colors.ENDC}")
    
    def stop_all(self):
        """Detiene todos los servidores"""
        print(f"\n{Colors.WARNING}⏹️  Deteniendo todos los servidores...{Colors.ENDC}\n")
        self.stop_server(self.backend_pid, "Backend")
        self.stop_server(self.frontend_pid, "Frontend")
        print(f"\n{Colors.OKGREEN}✅ Servidores detenidos{Colors.ENDC}")
    
    def show_menu(self):
        """Muestra el menú principal"""
        print(f"\n{Colors.BOLD}═══════════════ MENÚ ═══════════════{Colors.ENDC}")
        print("1. 🚀 Iniciar ambos servidores (ventanas separadas)")
        print("2. 🔧 Iniciar solo backend")
        print("3. 🔧 Iniciar solo frontend")
        print("4. 📊 Ver estado de los servidores")
        print("5. ⏹️  Detener servidor backend")
        print("6. ⏹️  Detener servidor frontend")
        print("7. ⏹️  Detener todos los servidores")
        print("8. ❌ Salir")
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
                    time.sleep(1)
                    self.start_frontend()
                    print(f"\n{Colors.OKGREEN}✅ Servidores iniciados en ventanas separadas{Colors.ENDC}")
                    print(f"\n{Colors.WARNING}💡 Cierra las ventanas de PowerShell o usa la opción 7 para detener{Colors.ENDC}")
                elif choice == '2':
                    self.start_backend()
                elif choice == '3':
                    self.start_frontend()
                elif choice == '4':
                    self.check_servers_status()
                elif choice == '5':
                    self.stop_server(self.backend_pid, "Backend")
                    self.backend_pid = None
                elif choice == '6':
                    self.stop_server(self.frontend_pid, "Frontend")
                    self.frontend_pid = None
                elif choice == '7':
                    self.stop_all()
                    self.backend_pid = None
                    self.frontend_pid = None
                elif choice == '8':
                    print(f"\n{Colors.WARNING}👋 Cerrando Server Manager...{Colors.ENDC}")
                    backend_running, frontend_running = self.check_servers_status()
                    if backend_running or frontend_running:
                        stop = input(f"{Colors.WARNING}⚠️  Hay servidores activos. ¿Detenerlos antes de salir? (s/n): {Colors.ENDC}").strip().lower()
                        if stop == 's':
                            self.stop_all()
                    print(f"{Colors.OKGREEN}✅ ¡Hasta luego!{Colors.ENDC}\n")
                    sys.exit(0)
                else:
                    print(f"{Colors.FAIL}❌ Opción inválida. Intenta de nuevo.{Colors.ENDC}")
                
        except KeyboardInterrupt:
            print(f"\n\n{Colors.WARNING}⚠️  Interrupción detectada (Ctrl+C){Colors.ENDC}")
            self.stop_all()
            print(f"{Colors.OKGREEN}✅ ¡Hasta luego!{Colors.ENDC}\n")
            sys.exit(0)

if __name__ == '__main__':
    # Verificar que psutil esté instalado
    try:
        import psutil
    except ImportError:
        print("❌ Error: Se requiere el módulo 'psutil'")
        print("\nInstalando psutil...")
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'psutil'])
        print("✅ psutil instalado. Por favor, ejecuta el script nuevamente.")
        sys.exit(0)
    
    manager = SeparateWindowsManager()
    manager.run()
