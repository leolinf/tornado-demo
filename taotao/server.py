# -*- coding=utf-8 -*-
# Created Time: 2015年09月03日 星期四 22时48分09秒
# File Name: server.py

import tornado.ioloop
import tornado.options
import tornado.httpserver
from tornado.options import define, options


define('port', default=8003, help='run on the given port', type=int)
define('host', default='0.0.0.0', help='bind on the given ip', type=str)

if __name__ == '__main__':
    tornado.options.parse_command_line()

    from application import app

    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(options.port, address=options.host)

    io_loop = tornado.ioloop.IOLoop.instance()
    io_loop.start()
