"""
Development server runner for ExoPlanet AI API
"""

import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    import socket
    import sys
    
    # Find an available port starting from 8001 (since 8000 seems to be in use)
    port = 8001
    max_attempts = 10
    
    for attempt in range(max_attempts):
        try:
            # Test if port is available
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('0.0.0.0', port))
            print(f"🚀 Starting ExoPlanet AI Backend on port {port}")
            break
        except OSError:
            print(f"Port {port} is in use, trying {port + 1}...")
            port += 1
            if attempt == max_attempts - 1:
                print(f"Could not find available port after {max_attempts} attempts")
                sys.exit(1)
    
    try:
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=port,
            reload=settings.DEBUG,
            log_level="info",
            access_log=True
        )
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)