# -*- coding: utf-8 -*-

from tornado.testing import AsyncHTTPTestCase

from application import app


class BaseTestCase(AsyncHTTPTestCase):

    def get_app(self):
        """重写方法,返回应用实例"""

        return app
