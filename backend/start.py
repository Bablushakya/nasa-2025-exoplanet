#!/usr/bin/env python3
"""
Quick start script for ExoPlanet AI Backend
"""

import asyncio
import subprocess
import sys
import os
from pathlib import Path

def run_command(command, cwd=None):
    """Run a shell command"""
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            check=True, 
            capture_output=True, 
            text=True,
            cwd=cwd
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"❌ Command failed: {command}")
        print(f"Error: {e.stderr}")
        return None

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ is required")
        sys.exit(1)
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")

def setup_environment():
    """Set up the development environment"""
    print("🔧 Setting up development environment...")
    
    # Check if virtual environment exists
    venv_path = Path("venv")
    if not venv_path.exists():
        print("📦 Creating virtual environment...")
        run_command(f"{sys.executable} -m venv venv")
    
    # Determine activation script
    if os.name == 'nt':  # Windows
        activate_script = "venv\\Scripts\\activate"
        pip_path = "venv\\Scripts\\pip"
        python_path = "venv\\Scripts\\python"
    else:  # Unix/Linux/macOS
        activate_script = "venv/bin/activate"
        pip_path = "venv/bin/pip"
        python_path = "venv/bin/python"
    
    # Install dependencies
    print("📚 Installing dependencies...")
    result = run_command(f"{pip_path} install -r requirements.txt")
    if result is None:
        print("❌ Failed to install dependencies")
        sys.exit(1)
    
    return python_path

def initialize_database(python_path):
    """Initialize the database"""
    print("🗄️ Initializing database...")
    result = run_command(f"{python_path} scripts/init_db.py")
    if result is None:
        print("❌ Failed to initialize database")
        sys.exit(1)
    print("✅ Database initialized successfully")

def start_server(python_path):
    """Start the development server"""
    print("🚀 Starting ExoPlanet AI API server...")
    print("📍 Server will be available at: http://localhost:8000")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("🔍 Health Check: http://localhost:8000/health")
    print("\n⏹️  Press Ctrl+C to stop the server\n")
    
    try:
        # Start the server
        subprocess.run([
            python_path, "-m", "uvicorn", 
            "app.main:app", 
            "--reload", 
            "--host", "0.0.0.0", 
            "--port", "8000"
        ], check=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Server failed to start: {e}")
        sys.exit(1)

def main():
    """Main function"""
    print("🌌 ExoPlanet AI Backend - Quick Start")
    print("=" * 50)
    
    # Check Python version
    check_python_version()
    
    # Setup environment
    python_path = setup_environment()
    
    # Initialize database
    initialize_database(python_path)
    
    # Start server
    start_server(python_path)

if __name__ == "__main__":
    main()