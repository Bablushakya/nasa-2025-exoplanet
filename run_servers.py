#!/usr/bin/env python3
"""
Run both frontend and backend servers for ExoPlanet AI
"""

import subprocess
import sys
import time
import webbrowser
import os
import signal
from threading import Thread

def run_backend():
    """Run the backend server"""
    print("🚀 Starting Backend Server...")
    try:
        # Change to backend directory and run
        backend_process = subprocess.Popen([
            sys.executable, "run.py"
        ], cwd="backend")
        return backend_process
    except Exception as e:
        print(f"❌ Error starting backend: {e}")
        return None

def run_frontend():
    """Run the frontend server"""
    print("🌐 Starting Frontend Server...")
    try:
        frontend_process = subprocess.Popen([
            sys.executable, "start_frontend.py"
        ])
        return frontend_process
    except Exception as e:
        print(f"❌ Error starting frontend: {e}")
        return None

def main():
    print("🚀 ExoPlanet AI - Full Stack Application")
    print("=" * 50)
    
    # Start backend in a separate thread
    backend_process = run_backend()
    if not backend_process:
        print("❌ Failed to start backend")
        return
    
    # Wait a moment for backend to start
    time.sleep(3)
    
    # Start frontend
    frontend_process = run_frontend()
    if not frontend_process:
        print("❌ Failed to start frontend")
        backend_process.terminate()
        return
    
    # Wait a moment for frontend to start
    time.sleep(2)
    
    print("\n" + "=" * 50)
    print("🎉 ExoPlanet AI is now running!")
    print("🌐 Frontend: http://localhost:3000")
    print("🔧 Backend API: http://localhost:8001")
    print("📚 API Docs: http://localhost:8001/docs")
    print("⏹️  Press Ctrl+C to stop both servers")
    print("=" * 50)
    
    try:
        # Keep the script running
        while True:
            # Check if processes are still running
            if backend_process.poll() is not None:
                print("❌ Backend process stopped")
                break
            if frontend_process.poll() is not None:
                print("❌ Frontend process stopped")
                break
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Shutting down servers...")
        
        # Terminate processes gracefully
        try:
            frontend_process.terminate()
            backend_process.terminate()
            
            # Wait for processes to terminate
            frontend_process.wait(timeout=5)
            backend_process.wait(timeout=5)
            
        except subprocess.TimeoutExpired:
            print("⚠️  Force killing processes...")
            frontend_process.kill()
            backend_process.kill()
        except:
            pass
        
        print("✅ Servers stopped")

if __name__ == "__main__":
    main()