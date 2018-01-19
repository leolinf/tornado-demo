# -*- coding: utf-8 -*-
"""
通用的模块
"""

import uuid
import base64
import traceback

from mongoengine import ValidationError

from settings import RLYUN_FOR_TEMPID, RLYUN_REG_TEMPID, EMAIL_FOR, EMAIL_REG,\
    EMAIL_QUEUE, SMS_QUEUE
from base.handler import BaseHandler
from core.utils import create_validate_code
from core.manager import ImageCodeManager, UserManager, VerifyCodeManager
from task.tasks import send_sms, send_email
import const


class ImageCodeHandler(BaseHandler):
    """获取图片验证码"""

    def get(self, *args, **kwargs):

        key = self.get_argument('key', '')
        if not key:
            key = str(uuid.uuid4())

        img, code = create_validate_code()
        ImageCodeManager.set_imagecode(key, code)

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
            'data': {'image': base64.b64encode(img), 'key': key},
        }
        self.write(res)


class CheckImageCodeHandler(BaseHandler):
    """校验图片验证码"""

    def post(self, *args, **kwargs):

        try:
            key = self.parse_body('key', '')
            img_code = self.parse_body('imgCode', '')
        except ValueError:
            self.raise_error(const.INVALID_TYPE)
            return

        if not ImageCodeManager.check_imagecode(key, img_code.lower()):
            self.raise_error(const.INVALID_IMAGE_CODE)
            return

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
        }
        self.write(res)


class VerifycodeHandler(BaseHandler):
    """获取验证码"""

    def get(self, *args, **kwargs):

        username = self.get_argument('username', '')
        verify_type = int(self.get_argument('verifyType', const.VERIFY_REG))
        key = self.get_argument('key', '')
        img_code = self.get_argument('imgCode', '')

        # 找回密码但用户不存在
        if verify_type and not UserManager.get_user_by_username(username):
            self.raise_error(const.USER_EMPTY)
            return

        # 图片验证码不对
        if not ImageCodeManager.check_imagecode(key, img_code):
            self.raise_error(const.INVALID_IMAGE_CODE)
            return

        try:
            verifycode = VerifyCodeManager.get_verify_code(
                username, verify_type)
        except ValidationError:
            traceback.print_exc()
            self.raise_error(const.INVALID_TYPE)
            return

        # 太频繁
        if verifycode == 'quick':
            self.raise_error(const.TOO_FREQUENT)
            return
        # 超过每日次数
        elif verifycode == 'tomorrow':
            self.raise_error(const.WAIT_TOMORROW)
            return
        # 注册过了
        elif verifycode == 'exists':
            self.raise_error(const.ALREADY_EXISTS)
            return

        # 0是注册1是找回
        temp_id = RLYUN_FOR_TEMPID if verify_type else RLYUN_REG_TEMPID
        v_type = EMAIL_FOR if verify_type else EMAIL_REG

        if username.isdigit():
            send_sms.apply_async(
                args=[username, verifycode, temp_id], queue=SMS_QUEUE)
        else:
            send_email.apply_async(
                args=[username, verifycode, v_type], queue=EMAIL_QUEUE)

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
        }
        self.write(res)
