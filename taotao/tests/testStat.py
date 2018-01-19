# -*- coding: utf-8 -*-


import sys
sys.path.append('../')
import urllib
import json
import datetime

from tornado.test.util import unittest
import tornado.escape
import bcrypt

from api.models import User, Data, AttachmentDownload
from base.test import BaseTestCase
import const


class AttachmentTestCase(BaseTestCase):
    """附件下载"""

    def setUp(self):

        now = datetime.datetime.utcnow()

        self.data = Data(
            title='haha', release_time=now,
            attachment='http://123.com/oo.xls',
            attachmentName='nihao',
            data_type=0,
        ).save()

        pwd = bcrypt.hashpw(tornado.escape.utf8('123456'), bcrypt.gensalt())
        self.user = User(
            username='15123456789',
            password=pwd,
            user_type=const.CUSTOMER,
        ).save()

        super(AttachmentTestCase, self).setUp()

    def tearDown(self):

        self.user.delete()
        self.data.delete()
        super(AttachmentTestCase, self).tearDown()

    def testDown1(self):
        """下载, 未登录"""

        resp = self.fetch('/v3/api/getAttachmentURI')
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.PERMISSION_DENIED)

    def testDown2(self):
        """下载,成功"""

        data = {'username': '15123456789', 'password': '123456'}
        resp = self.fetch(
            '/v3/api/token', method='POST', body=json.dumps(data))
        res = json.loads(resp.body)
        token = res['data']['token']

        data = {'baseUrl': 'http://123.com/oo.xls'}
        query = urllib.urlencode(data)
        resp = self.fetch(
            '/v3/api/getAttachmentURI?{0}'.format(query),
            headers={'Token': token})
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)
        self.assertTrue('privateUrl' in res['data'])
        ad = AttachmentDownload.objects(
            attachment='http://123.com/oo.xls').first()
        self.assertNotEqual(ad, None)
        ad.delete()


if __name__ == '__main__':

    unittest.main()
