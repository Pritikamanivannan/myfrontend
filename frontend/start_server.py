# Python Server for AI Manufacturing Scheduler
import http.server
import socketserver
import webbrowser
import os
import sys
import socket

PORT = 8080

def get_lan_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS and disable aggressive caching for dev
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def run():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    lan_ip = get_lan_ip()
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("=" * 64)
        print("  OptiManufact AI - Manufacturing Planning & Scheduling System")
        print("=" * 64)
        print("\n  [1] On this Computer (Local):")
        print(f"      http://localhost:{PORT}")
        print("\n  [2] Share with Friends on the Same Wi-Fi / Hotspot:")
        print(f"      http://{lan_ip}:{PORT}")
        print("\n  [3] Share Over the Internet (Worldwide):")
        print("      Run 'share_publicly.bat' to get an instant HTTPS link,")
        print("      or drag this folder to https://app.netlify.com/drop (Free 24/7).")
        print("=" * 64)
        print("  Press Ctrl+C to stop the server\n")
        try:
            webbrowser.open(f"http://localhost:{PORT}")
        except Exception:
            pass
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")

if __name__ == "__main__":
    run()
