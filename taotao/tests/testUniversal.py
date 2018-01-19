# -*- coding: utf-8 -*-

import sys
sys.path.append('../')
import urllib
import json
import uuid
import random

from tornado.test.util import unittest
import tornado.escape
import bcrypt

from api.models import ImageCode, User, VerifyCode
from base.test import BaseTestCase
import const


class ImgCodeTestCase(BaseTestCase):
    """图形验证码"""

    def setUp(self):
        self.key = str(uuid.uuid4())
        ImageCode(key=self.key, code='hehe').save()

        super(ImgCodeTestCase, self).setUp()

    def tearDown(self):

        ImageCode.objects(key=self.key).delete()

        super(ImgCodeTestCase, self).tearDown()

    def testImage1(self):
        """没有key"""

        resp = self.fetch('/v3/api/imgCode')
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)
        self.assertListEqual(['image', 'key'], res['data'].keys())
        ImageCode.objects(key=res['data']['key']).delete()

    def testImage2(self):
        """有key"""

        data = {'key': self.key}
        query = urllib.urlencode(data)
        resp = self.fetch('/v3/api/imgCode?{0}'.format(query))
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)
        self.assertListEqual(['image', 'key'], res['data'].keys())
        self.assertEqual(self.key, res['data']['key'])

    def testCheckImage1(self):
        """验证错了"""

        data = {'key': self.key, 'imgCode': 'haha'}
        resp = self.fetch(
            '/v3/api/imgCode/check', body=json.dumps(data), method='POST')
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.INVALID_IMAGE_CODE)

    def testCheckImage2(self):
        """验证对了"""

        data = {'key': self.key, 'imgCode': 'hehe'}
        resp = self.fetch(
            '/v3/api/imgCode/check', body=json.dumps(data), method='POST')
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)


class VerifyCodeTestCase(BaseTestCase):
    """注册找回密码的验证码"""

    def setUp(self):

        a = random.randint(1000000, 9999999)
        self.username = '{0}@qq.com'.format(a)
        pwd = bcrypt.hashpw(tornado.escape.utf8('123456'), bcrypt.gensalt())
        self.user = User(
            username=self.username,
            password=pwd,
            user_type=const.CUSTOMER
        ).save()

        self.key = str(uuid.uuid4())
        ImageCode(key=self.key, code='hehe').save()

        super(VerifyCodeTestCase, self).setUp()

    def tearDown(self):

        User.objects(username=self.username).delete()
        ImageCode.objects(key=self.key).delete()

        super(VerifyCodeTestCase, self).setUp()

    def testVerifyCode1(self):
        """获取注册验证码,注册过了"""

        data = {
            'imgCode': 'hehe', 'key': self.key, 'username': self.username}
        query = urllib.urlencode(data)
        resp = self.fetch('/v3/api/verifyCode?{0}'.format(query))
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.ALREADY_EXISTS)

    def testVerifyCode2(self):
        """获取注册验证码,图形验证码错了"""

        a = random.randint(10000, 99999)
        username = '{0}@qq.com'.format(a)
        data = {
            'imgCode': 'haha', 'key': self.key, 'username': username}
        query = urllib.urlencode(data)
        resp = self.fetch('/v3/api/verifyCode?{0}'.format(query))
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.INVALID_IMAGE_CODE)

    def testVerifyCode3(self):
        """获取注册验证码, 对了"""

        a = random.randint(10000, 99999)
        username = '{0}@qq.com'.format(a)
        data = {
            'imgCode': 'hehe', 'key': self.key, 'username': username}
        query = urllib.urlencode(data)
        resp = self.fetch('/v3/api/verifyCode?{0}'.format(query))
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)
        VerifyCode.objects(username=username).delete()

    def testVerifyCode4(self):
        """获取找回密码验证码,用户不存在"""

        a = random.randint(10000, 99999)
        username = '{0}@qq.com'.format(a)
        data = {
            'imgCode': 'hehe', 'key': self.key, 'username': username,
            'verifyType': const.VERIFY_FOR
        }
        query = urllib.urlencode(data)
        resp = self.fetch('/v3/api/verifyCode?{0}'.format(query))
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.USER_EMPTY)

    def testVerifyCode5(self):
        """获取找回密码验证码,对了"""

        data = {
            'imgCode': 'hehe', 'key': self.key, 'username': self.username,
            'verifyType': const.VERIFY_FOR
        }
        query = urllib.urlencode(data)
        resp = self.fetch('/v3/api/verifyCode?{0}'.format(query))
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)
        VerifyCode.objects(username=self.username).delete()


if __name__ == '__main__':

    unittest.main()
