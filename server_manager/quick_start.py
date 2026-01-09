#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Quick Start - Inicio rápido de servidores sin menú interactivo
Simplemente inicia ambos servidores y mantiene los logs visibles
"""

import subprocess
import sys
import signal
from pathlib import Path
from threading import Thread

class QuickStart:
    def __init__(self):
        self.script_dir = Path(__file__).parent
        self.project_root = self.script_dir.parent
        self.backend_dir = self.project_root / 'backend'
        self.frontend_dir = self.project_root / 'frontend'
        self.processes = []
        
    def start_server(self, name, cmd, cwd, color_code):
        """Inicia un servidor y captura su salida"""
        print(f"\n🚀 Iniciando {name}...")
        
        creationflags = subprocess.CREATE_NEW_PROCESS_GROUP if sys.platform == 'win32' else 0
        shell = True if 'npm' in cmd[0] else False
        
        process = subprocess.Popen(
            cmd,
            cwd=str(cwd),
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
            creationflags=creationflags,
            shell=shell
        )
        
        self.processes.append(process)
        
        # Thread para mostrar salida
        def show_output():
            for line in iter(process.stdout.readline, ''):
                if line:
                    print(f"\033[{color_code}m[{name}]\033[0m {line.rstrip()}")
        
        Thread(target=show_output, daemon=True).start()
        return process
    
    def cleanup(self, signum=None, frame=None):
        """Limpia los procesos al salir"""
        print("\n\n⏹️  Deteniendo servidores...")
        for process in self.processes:
            try:
                if process.poll() is None:  # Solo si el proceso está corriendo
                    if sys.platform == 'win32':
                        # En Windows, matar el árbol de procesos completo
                        subprocess.run(
                            ['taskkill', '/F', '/T', '/PID', str(process.pid)],
                            stdout=subprocess.DEVNULL,
                            stderr=subprocess.DEVNULL
                        )
                    else:
                        process.terminate()
                        process.wait(timeout=3)
            except Exception as e:
                try:
                    process.kill()
                except:
                    pass
        print("✅ Servidores detenidos. ¡Hasta luego!\n")
        sys.exit(0)
    
    def run(self):
        """Ejecuta los servidores"""
        print("\n" + "="*50)
        print("  AquaTenex - Quick Start")
        print("="*50)
        
        # Registrar manejador de señales
        signal.signal(signal.SIGINT, self.cleanup)
        if hasattr(signal, 'SIGBREAK'):
            signal.signal(signal.SIGBREAK, self.cleanup)
        
        # Iniciar backend
        backend = self.start_server(
            "BACKEND",
            ['php', 'artisan', 'serve'],
            self.backend_dir,
            94  # Azul
        )
        
        # Iniciar frontend
        frontend = self.start_server(
            "FRONTEND",
            ['npm', 'run', 'dev'],
            self.frontend_dir,
            96  # Cyan
        )
        
        print("\n" + "="*50)
        print("✅ Servidores iniciados")
        print("   Backend:  http://localhost:8000")
        print("   Frontend: http://localhost:5173")
        print("\n💡 Presiona Ctrl+C para detener los servidores")
        print("="*50 + "\n")
        
        # Esperar a que los procesos terminen
        try:
            backend.wait()
            frontend.wait()
        except KeyboardInterrupt:
            self.cleanup()

if __name__ == '__main__':
    quick = QuickStart()
    quick.run()
