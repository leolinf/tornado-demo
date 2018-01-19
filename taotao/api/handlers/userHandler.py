# -*- coding: utf-8 -*-

from mongoengine import NotUniqueError, ValidationError, DoesNotExist
import tornado.gen

from base.handler import BaseHandler
from core.auth import authenticate, validate_password, gen_access_token,\
    parse_access_token
from core.manager import VerifyCodeManager, UserManager
import const


class TokenHandler(BaseHandler):
    """普通登陆"""

    @tornado.gen.coroutine
    def post(self, *args, **kwargs):

        try:
            username = self.parse_body('username', '')
            password = self.parse_body('password', '')
        except ValueError:
            self.raise_error(const.INVALID_TYPE)
            return

        user = yield authenticate(username, password)

        # 账号密码不对
        if user is None:
            self.raise_error(const.INVALID_USER)
            return

        # 账号被锁定
        if user.is_active == const.BLOCKED:
            self.raise_error(const.USER_BLOCKED)
            return

        token = self.gen_token(user=user)
        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
            'data': {'token': token},
        }
        self.write(res)


class RegisterHandler(BaseHandler):
    """注册"""

    def post(self, *args, **kwargs):
        """注册"""

        try:
            username = self.parse_body('username', '')
            password = self.parse_body('password', '')
            password_confirm = self.parse_body('passwordConfirm', '')
            verifycode = self.parse_body('verifyCode', '')
            if not validate_password(password):
                raise ValueError
        except ValueError:
            self.raise_error(const.INVALID_TYPE)
            return

        # 两次密码不一样
        if password != password_confirm or not password:
            self.raise_error(const.NOT_MATCH)
            return

        # 验证码不对
        if not VerifyCodeManager.check_verify_code(username, verifycode):
            self.raise_error(const.INVALID_VERIFY_CODE)
            return

        # 创建用户
        try:
            user = UserManager.create_normal_user(username, password)
        except NotUniqueError:
            self.raise_error(const.ALREADY_EXISTS)
            return
        except ValidationError:
            self.raise_error(const.INVALID_TYPE)
            return

        token = self.gen_token(user=user)

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
            'data': {'token': token},
        }
        self.write(res)


class RetrieveHandler(BaseHandler):
    """找回密码第一步"""

    def get(self, *args, **kwargs):

        username = self.get_argument('username', '')
        verifycode = self.get_argument('verifyCode', '')

        # 验证码不对
        if not VerifyCodeManager.check_verify_code(username, verifycode):
            self.raise_error(const.INVALID_VERIFY_CODE)
            return

        # 生成access_token
        access_token = gen_access_token(username)

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
            'data': {
                'accessToken': access_token,
                'username': username,
            },
        }
        self.write(res)


class Retrieve2ndHandler(BaseHandler):
    """找回密码第二步"""

    def post(self, *args, **kwargs):

        try:
            access_token = self.parse_body('accessToken', '')
            password = self.parse_body('password', '')
            password_confirm = self.parse_body('passwordConfirm', '')
            if not validate_password(password):
                raise ValueError
        except ValueError:
            self.raise_error(const.INVALID_TYPE)
            return

        # 两次密码不正确
        if password != password_confirm or not password:
            self.raise_error(const.NOT_MATCH)
            return

        # 解析access_token
        r = parse_access_token(access_token)
        if r is None:
            self.raise_error(const.NEED_REFRESH)
            return

        username = r.get('username')

        # 改密码
        try:
            UserManager.set_password(username, password)
        except DoesNotExist:
            self.raise_error(const.NOT_EXISTS)
            return
        except:
            self.raise_error(const.UNKNOWN_ERROR)
            return

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
        }
        self.write(res)
