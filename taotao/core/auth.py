# -*- coding: utf-8 -*-

import functools
import datetime
import re

import bcrypt
import tornado.escape
import tornado.gen

from settings import ACCESS_TOKEN_EXP
from core.manager import UserManager
from core.utils import decrypt_token, encrypt_token
from api.models import RetrieveToken
import const


@tornado.gen.coroutine
def authenticate(username, password):
    """验证用户"""

    user = UserManager.get_user_by_username(username)

    if user is None:
        return None

    pwd = bcrypt.hashpw(
        tornado.escape.utf8(password), tornado.escape.utf8(user.password))
    if pwd == user.password:
        return user
    else:
        return None


def login_required(permission=[const.CUSTOMER, const.MANAGER]):
    """需要登陆以及权限控制"""

    def decorator(function):
        @functools.wraps(function)
        def wrapper(req, *args, **kwargs):
            # 获取token
            try:
                token = req.request.headers.get('Token')
            except ValueError:
                req.raise_error(const.INVALID_TYPE)
                return
            else:
                # 解析token
                token_data = decrypt_token(token)

            if token_data is None:
                # 过期或者什么原因token无效
                req.raise_error(const.NEED_REFRESH)
                return
            elif token_data.get('userType') not in permission:
                # 没有权限
                req.raise_error(const.PERMISSION_DENIED)
                return
            else:
                # 添加token_data属性
                req.__setattr__('token_data', token_data)

            result = function(req, *args, **kwargs)
            return result
        return wrapper
    return decorator


def validate_password(password):
    """判断密码是否符合条件"""

    pattern = re.compile('^[0-9A-Za-z]+$')
    return bool(pattern.match(password))


def gen_access_token(username):
    """找回密码第一步生成的，用于第二步"""

    now = datetime.datetime.utcnow()

    t = now + datetime.timedelta(seconds=ACCESS_TOKEN_EXP)
    payload = {
        'username': username,
        'exp': t,
    }
    token = encrypt_token(payload)

    RetrieveToken.objects(access_token=token).update(
        upsert=True,
        set__access_token=token,
        set__username=username,
        set__create_time=now,
        set__is_used=0
    )

    return token


def parse_access_token(access_token):
    """找回密码第二步"""

    rt = RetrieveToken.objects(access_token=access_token).first()
    if not rt or rt.is_used:
        return None

    rt.update(set__is_used=1)

    return decrypt_token(access_token)
