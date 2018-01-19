# -*- coding=utf-8 -*-
# Created Time: 2015年09月03日 星期四 22时45分22秒
# File Name: application.py

import tornado.web
import tornado.log
import tornado.wsgi

from urls import urls
from settings import settings


url = (
    r'/(.*)',
    tornado.web.StaticFileHandler,
    dict(path=settings['static_path'])
)

urls.append(url)

app = tornado.web.Application(
    handlers=urls, **settings
)

wapp = tornado.wsgi.WSGIAdapter(app)
