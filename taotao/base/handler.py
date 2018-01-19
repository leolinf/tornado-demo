#!/usr/bin/env python
# -*- coding=utf-8 -*-

import traceback
import datetime
import json

from bson import ObjectId
import tornado.web
import redis

from settings import REDIS_HOST, REDIS_TTL, JWT_EXP
from core.utils import decrypt_token, encrypt_token
import const


def write_error(self, status_code, **kwargs):

    if self.settings.get("serve_traceback") and "exc_info" in kwargs:
        # in debug mode, try to send a traceback
        self.set_header('Content-Type', 'text/plain')
        for line in traceback.format_exception(*kwargs["exc_info"]):
            self.write(line)
        self.finish()
    else:
        if status_code == 404:
            self.render('modules/core/frame.tpl.html')

        else:
            self.finish("<html><title>%(code)d: %(message)s</title>"
                        "<body>%(code)d: %(message)s</body></html>" % {
                            "code": status_code,
                            "message": self._reason,
                        })


setattr(tornado.web.RequestHandler, 'write_error', write_error)


class BaseHandler(tornado.web.RequestHandler):
    """定制的RequestHandler"""

    def prepare(self):
        """检查参数等"""

        arguments = {k: v[0] for k, v in self.request.arguments.items()}

        mustdigit = ['start', 'count']
        mustobjectid = ['dataId']

        if not all(
                arguments[i].isdigit() for i in mustdigit if i in arguments):
            self.raise_error(const.INVALID_TYPE)
            self.finish()

        if not all(
                ObjectId.is_valid(arguments[i]) for i in mustobjectid
                if i in arguments):
            self.raise_error(const.INVALID_TYPE)
            self.finish()

    def raise_error(self, errorCode):
        """报异常"""

        res = {
            'errorCode': errorCode,
            'errorMsg': const.MSG[errorCode],
        }
        self.write(res)

    def parse_token(self, token=None):
        """解析token"""

        if token is None:
            token = self.request.headers.get('token')

        # 解析token
        res = decrypt_token(token)
        return res

    def gen_token(self, u_id=None, detail=None, u_type=0, user=None):
        """生成token"""

        t = datetime.datetime.utcnow() +\
            datetime.timedelta(seconds=JWT_EXP)

        payload = {
            'userId': str(user.id),
            'userType': user.user_type,
            'exp': t,
            'username': user.username,
        }

        return encrypt_token(payload)

    def parse_body(self, k, v=None):
        """处理post请求的json数据"""

        body = json.loads(self.request.body)
        return body.get(k, v)


class RedisCacheHandler(tornado.web.RequestHandler):
    """缓存用的"""

    has_cache_in_redis = False
    check_can_cache_result = True

    @property
    def client(self):

        client = redis.Redis(REDIS_HOST)
        return client

    def prepare(self):

        if not self.check_can_cache_result:
            return

        cache_key = self.request.uri

        res = self.client.get(cache_key)

        if res:
            self.has_cache_in_redis = True
            self.write(res)
            self.finish()

    def flush(self, include_footers=False, callback=None):

        if self.has_cache_in_redis or not self.check_can_cache_result:
            pass
        elif self._status_code != 200:
            pass
        else:
            res = self._write_buffer[0]
            cache_key = self.request.uri
            self.client.set(cache_key, res)
            self.client.expire(cache_key, REDIS_TTL)

        super(RedisCacheHandler, self).flush(include_footers, callback)
