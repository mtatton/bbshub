import re
from tornado.web import RequestHandler, Application
import tornado.web as web
from tornado.websocket import WebSocketHandler
from tornado.ioloop import IOLoop
from tornado.platform.asyncio import AsyncIOMainLoop
import tornado.httpserver as httpserver

import asyncio
import socket
import threading
import queue
import select
import time

class AsyncSocket(threading.Thread):
    def __init__(self, host, port, read_callback, disconnect_callback=None):
        threading.Thread.__init__(self)
        self.host = host
        self.port = port
        self.bufsize = 256
        self.socket = None
        self.alive = threading.Event()
        self.disconnect_callback = disconnect_callback

        self.read_callback = read_callback
        self.write_queue = queue.Queue()

    def join(self, timeout=None):
        self.socket.close()
        self.alive.clear()
        threading.Thread.join(self, timeout)

    def connect(self, host=None, port=None):
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.connect((host or self.host, port or self.port))
        self.alive.set()

    def put(self, data):
        if self.alive.isSet():
            self.write_queue.put(data)
        else:
            raise Exception('Disconnected')

    def run(self):
        self.connect()
        while self.alive.isSet():


            sread, swrite, sexc = select.select([], [self.socket], [], 0.01)
            for sock in swrite:
                if sock == self.socket:
                    while True:
                        cmd_list = []
                        try:
                            cmd_list.append(self.write_queue.get(block=False))
                        except queue.Empty:
                            break
                        if cmd_list:
                            sock.send(''.join(cmd_list))

            sread, swrite, sexc = select.select([self.socket], [], [], 0.01)
            for sock in sread:
                if sock == self.socket:
                    try:
                        data = sock.recv(self.bufsize)
                        if not data:
                            raise Exception('Socket disconnect')
                        self.read_callback(data)

                    except Exception as e:
                        if self.disconnect_callback:
                            self.disconnect_callback(e)
                        print('Socket exception: ', e)


ON_CONNECT = """
Thank You for using this proxy ServeThank You for using this proxy server.
"""
TELNET_GA = chr(249)
TELNET_IAC = chr(255)

class MessagesHandler(WebSocketHandler):

    sock = None
    
    def check_origin(self, origin):
      return(True)

    def open(self,p_hostname,p_port):

        self.write_message('Successfully connected to proxy server\n')
        self.encoding = 'latin-1'
        self.sock = None

        self.hostname = p_hostname
        self.port=p_port
        print("Connecting to " + p_hostname + ":" + p_port)

        self.replace_ga = True

        self.sock = AsyncSocket(self.hostname, int(self.port), self.process_server_response, self.server_disconnect_handler)
        self.sock.start()

    def process_server_response(self, data):

        self.write_message(data.decode(self.encoding,'replace'))


    def process_command(self, command):
        match = re.match(r'#connect (.+):(\d+) (.+)', command)
        if match:
            if self.sock:
                self.write_message('Nope')
                return False

            self.encoding = match.group(3).strip()
            self.sock = AsyncSocket(match.group(1), int(match.group(2)), self.process_server_response, self.server_disconnect_handler)
            self.sock.start()

            return True

        if not self.sock:
            self.write_message(ON_CONNECT)
            return True

        if command.startswith('#disconnect'):
            self.close_server_socket()
            return True

        return False

    def close_server_socket(self):
        if self.sock is None:
            return
        self.sock.socket.close()
        self.sock.alive.clear()
        self.sock = None

    def server_disconnect_handler(self, msg):
        try:
            self.close_server_socket() # cannot join
        except Exception as e:
            print(e)

        self.write_message('Disconnected: %s' % msg)

    def on_message(self, message):
        if not self.process_command(message):
            try:
                encoded_message = message.encode(self.encoding)
                encoded_message = encoded_message.replace(TELNET_IAC, TELNET_IAC*2)
                self.sock.put(encoded_message)
            except Exception as e:
                print(e)

    def on_close(self):
        self.close_server_socket()
        print("WebSocket closed")

#application = Application([
#    (r'/(.*)/(\d+)', MessagesHandler)
#])



class WebServer(web.Application):

    def __init__(self):
        handlers = [ (r'/(.*)/(\d+)', MessagesHandler), ]
        settings = {'debug': True}
        super().__init__(handlers, **settings)

    def run(self, port=8080):
        self.listen(port)
        IOLoop.instance().start()

ws = WebServer()


def start_server():
    asyncio.set_event_loop(asyncio.new_event_loop())
    ws.run()


from threading import Thread
t = Thread(target=start_server, args=())
t.daemon = True
t.start()

t.join()
