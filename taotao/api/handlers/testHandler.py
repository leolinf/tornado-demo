# -*- coding: utf-8 -*-

from base.handler import BaseHandler


class TestHandler(BaseHandler):
    """测试用"""

    def get(self):

        print u'测试'

        self.write({'errorCode': 10000})
