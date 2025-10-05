#!/usr/bin/env python3
"""
Simple HTTP server to serve the ExoPlanet AI frontend
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 3000
DIRECTORY = "."

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    port = PORT
    max_attempts = 10
    
    for attempt in range(max_attempts):
        try:
            with socketserver.TCPServer(("", port), Handler) as httpd:
                print(f"🚀 ExoPlanet AI Frontend Server")
                print(f"📡 Serving at http://localhost:{port}")
                print(f"📁 Directory: {os.getcwd()}")
                print(f"🌐 Opening browser...")
                print(f"⏹️  Press Ctrl+C to stop the server")
                
                # Open browser
                webbrowser.open(f'http://localhost:{port}')
                
                try:
                    httpd.serve_forever()
                except KeyboardInterrupt:
                    print(f"\n🛑 Server stopped")
                    sys.exit(0)
                break
        except OSError as e:
            if e.errno == 10048 or 'address already in use' in str(e).lower():
                print(f"⚠️  Port {port} is already in use, trying {port + 1}...")
                port += 1
                if attempt == max_attempts - 1:
                    print(f"\n❌ Could not find an available port after {max_attempts} attempts.")
                    print(f"💡 Please close other applications or kill the process using port {PORT}")
                    print(f"💡 Run: netstat -ano | findstr :{PORT}")
                    sys.exit(1)
            else:
                raise

if __name__ == "__main__":
    main()