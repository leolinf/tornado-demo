# -*- coding: utf-8 -*-

import sys
sys.path.append('../')
import json

from tornado.test.util import unittest
from base.test import BaseTestCase


class TestTestCase(BaseTestCase):
    """测试测试页"""

    def testTest(self):
        """/api/test接口测试"""

        resp = self.fetch('/v3/api/test')
        res = json.loads(resp.body)
        self.assertDictEqual(res, {'errorCode': 10000})


if __name__ == '__main__':

    unittest.main()
