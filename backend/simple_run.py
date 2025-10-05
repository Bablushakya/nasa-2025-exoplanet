#!/usr/bin/env python3
"""
Simple server runner for ExoPlanet AI
This script starts the server with minimal dependencies
"""

import sys
import os

def check_dependencies():
    """Check if required packages are installed"""
    required_packages = ['fastapi', 'uvicorn', 'sqlalchemy', 'aiosqlite']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print("❌ Missing required packages:")
        for package in missing_packages:
            print(f"   - {package}")
        print("\n🔧 To install missing packages, run:")
        print(f"   pip install {' '.join(missing_packages)}")
        return False
    
    return True

def start_server():
    """Start the FastAPI server"""
    try:
        import uvicorn
        
        print("🌌 Starting ExoPlanet AI Server...")
        print("=" * 40)
        print("🌐 Server: http://localhost:8000")
        print("📖 API Docs: http://localhost:8000/docs")
        print("🔍 Health: http://localhost:8000/health")
        print("⏹️  Press Ctrl+C to stop")
        print("=" * 40)
        
        # Start server with basic configuration
        uvicorn.run(
            "simple_app:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
        
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Server failed to start: {e}")
        print("\nTroubleshooting:")
        print("1. Make sure all dependencies are installed")
        print("2. Check if port 8000 is available")
        print("3. Try running: pip install fastapi uvicorn")

if __name__ == "__main__":
    print("🚀 ExoPlanet AI - Simple Server")
    print("=" * 35)
    
    if not check_dependencies():
        sys.exit(1)
    
    start_server()