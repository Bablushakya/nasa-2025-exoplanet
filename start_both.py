#!/usr/bin/env python3
"""
Start both frontend and backend servers for ExoPlanet AI
"""

import subprocess
import sys
import time
import webbrowser
import socket
import os
from threading import Thread

def find_available_port(start_port):
    """Find an available port starting from start_port"""
    port = start_port
    max_attempts = 10
    
    for attempt in range(max_attempts):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('localhost', port))
            return port
        except OSError:
            port += 1
            if attempt == max_attempts - 1:
                print(f"❌ Could not find available port after {max_attempts} attempts")
                return None
    return port

def start_backend():
    """Start the backend server"""
    backend_port = find_available_port(8000)
    if not backend_port:
        print("❌ Could not start backend - no available port")
        return None
    
    print(f"🚀 Starting Backend on port {backend_port}...")
    
    # Update the backend port in run.py
    try:
        backend_process = subprocess.Popen([
            sys.executable, "backend/run.py"
        ], cwd=os.getcwd())
        
        # Give backend time to start
        time.sleep(3)
        
        if backend_process.poll() is None:
            print(f"✅ Backend started successfully on port {backend_port}")
            return backend_process, backend_port
        else:
            print("❌ Backend failed to start")
            return None, None
            
    except Exception as e:
        print(f"❌ Error starting backend: {e}")
        return None, None

def start_frontend():
    """Start the frontend server"""
    frontend_port = find_available_port(3000)
    if not frontend_port:
        print("❌ Could not start frontend - no available port")
        return None
    
    print(f"🌐 Starting Frontend on port {frontend_port}...")
    
    try:
        frontend_process = subprocess.Popen([
            sys.executable, "start_frontend.py"
        ], cwd=os.getcwd())
        
        # Give frontend time to start
        time.sleep(2)
        
        if frontend_process.poll() is None:
            print(f"✅ Frontend started successfully on port {frontend_port}")
            return frontend_process, frontend_port
        else:
            print("❌ Frontend failed to start")
            return None, None
            
    except Exception as e:
        print(f"❌ Error starting frontend: {e}")
        return None, None

def main():
    print("🚀 ExoPlanet AI - Starting Full Stack Application")
    print("=" * 50)
    
    # Start backend
    backend_result = start_backend()
    if not backend_result[0]:
        print("❌ Failed to start backend. Exiting.")
        return
    
    backend_process, backend_port = backend_result
    
    # Start frontend
    frontend_result = start_frontend()
    if not frontend_result[0]:
        print("❌ Failed to start frontend. Stopping backend.")
        backend_process.terminate()
        return
    
    frontend_process, frontend_port = frontend_result
    
    print("\n" + "=" * 50)
    print("🎉 ExoPlanet AI is now running!")
    print(f"🌐 Frontend: http://localhost:{frontend_port}")
    print(f"🔧 Backend API: http://localhost:{backend_port}")
    print(f"📚 API Docs: http://localhost:{backend_port}/docs")
    print("⏹️  Press Ctrl+C to stop both servers")
    print("=" * 50)
    
    # Open browser to frontend
    webbrowser.open(f'http://localhost:{frontend_port}')
    
    try:
        # Wait for processes
        while True:
            if backend_process.poll() is not None:
                print("❌ Backend process stopped")
                break
            if frontend_process.poll() is not None:
                print("❌ Frontend process stopped")
                break
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Shutting down servers...")
        
        # Terminate processes
        try:
            frontend_process.terminate()
            backend_process.terminate()
            
            # Wait for graceful shutdown
            frontend_process.wait(timeout=5)
            backend_process.wait(timeout=5)
            
        except subprocess.TimeoutExpired:
            print("⚠️  Force killing processes...")
            frontend_process.kill()
            backend_process.kill()
        
        print("✅ Servers stopped successfully")

if __name__ == "__main__":
    main()