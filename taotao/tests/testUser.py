# -*- coding: utf-8 -*-

import sys
sys.path.append('../')
import urllib
import json
import datetime

from tornado.test.util import unittest
import tornado.escape
import bcrypt

from api.models import User, VerifyCode
from base.test import BaseTestCase
import const


class UserTestCase(BaseTestCase):
    """用户登陆注册"""

    def setUp(self):

        self.verifycode = VerifyCode(
            username='15123456789', verifycode='haha',
            create_time=datetime.datetime.now()).save()

        pwd = bcrypt.hashpw(tornado.escape.utf8('123456'), bcrypt.gensalt())
        self.user = User(
            username='15123456789',
            password=pwd,
            user_type=const.CUSTOMER
        ).save()
        super(UserTestCase, self).setUp()

    def tearDown(self):

        self.user.delete()
        self.verifycode.delete()
        super(UserTestCase, self).tearDown()

    def testLogin1(self):
        """登陆密码错误"""

        data = {'username': '15123456789', 'password': '123457'}
        resp = self.fetch(
            '/v3/api/token', method='POST', body=json.dumps(data))
        res = json.loads(resp.body)
        # 密码错误
        self.assertEqual(res['errorCode'], const.INVALID_USER)

    def testLogin2(self):
        """登陆密码正确"""

        data = {'username': '15123456789', 'password': '123456'}
        resp = self.fetch(
            '/v3/api/token', method='POST', body=json.dumps(data))
        res = json.loads(resp.body)
        # 密码正确
        self.assertEqual(res['errorCode'], const.SUCCESS)
        # 返回token
        self.assertTrue('token' in res['data'])

    def testRegister1(self):
        """注册,已经存在"""

        data = {
            'username': '15123456789', 'password': '123457',
            'passwordConfirm': '123457', 'verifyCode': 'haha',
        }
        resp = self.fetch('/v3/api/user', body=json.dumps(data), method='POST')
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.ALREADY_EXISTS)

    def testRegister2(self):
        """注册,两次密码不一样"""

        data = {
            'username': '15123456789', 'password': '1234578',
            'passwordConfirm': '123457', 'verifyCode': 'haha',
        }
        resp = self.fetch('/v3/api/user', body=json.dumps(data), method='POST')
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.NOT_MATCH)

    def testRegister3(self):
        """注册,验证码错误"""

        data = {
            'username': '15123456789', 'password': '123457',
            'passwordConfirm': '123457', 'verifyCode': 'hehe',
        }
        resp = self.fetch('/v3/api/user', body=json.dumps(data), method='POST')
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.INVALID_VERIFY_CODE)

    def testRegister4(self):
        """注册, 成功"""

        verifycode = VerifyCode(
            username='15123456780', verifycode='hehe',
            create_time=datetime.datetime.now()).save()

        data = {
            'username': '15123456780', 'password': '123457',
            'passwordConfirm': '123457', 'verifyCode': 'hehe',
        }
        resp = self.fetch('/v3/api/user', body=json.dumps(data), method='POST')
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)
        verifycode.delete()
        User.objects(username='15123456780').delete()

    def testRetrieve1(self):
        """找回密码第一步,对了"""

        data = {'username': '15123456789', 'verifyCode': 'haha'}
        query = urllib.urlencode(data)
        resp = self.fetch('/v3/api/user/pwd/retrieve1?{0}'.format(query))
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)

    def testRetrieve2(self):
        """找回密码第一步,验证码错了"""

        data = {'username': '15123456789', 'verifyCode': 'hehe'}
        query = urllib.urlencode(data)
        resp = self.fetch('/v3/api/user/pwd/retrieve1?{0}'.format(query))
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.INVALID_VERIFY_CODE)

    def testRetrieve3(self):
        """找回密码第二步"""

        data = {'username': '15123456789', 'verifyCode': 'haha'}
        query = urllib.urlencode(data)
        resp = self.fetch('/v3/api/user/pwd/retrieve1?{0}'.format(query))
        res = json.loads(resp.body)
        access_token = res['data']['accessToken']
        data = {
            'accessToken': access_token, 'password': '1111',
            'passwordConfirm': '1111'
        }
        resp = self.fetch(
            '/v3/api/user/pwd/retrieve2', body=json.dumps(data), method='POST')
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)
        user = User.objects.get(username='15123456789')
        pwd = bcrypt.hashpw(
            tornado.escape.utf8('1111'), tornado.escape.utf8(user.password))
        self.assertEqual(user.password, pwd)


if __name__ == '__main__':

    unittest.main()
