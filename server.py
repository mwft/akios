from http.server import HTTPServer, SimpleHTTPRequestHandler
import sys

if __name__ == '__main__':
    httpd = HTTPServer(('', int(sys.argv[1])), SimpleHTTPRequestHandler)
    try:
        print("Serving HTTP on", httpd.server_address , "port", httpd.server_port, "...")
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.server_close()
        sys.exit()
        
