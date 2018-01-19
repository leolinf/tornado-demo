# -*- coding=utf-8 -*-

import uuid

from base.handler import BaseHandler
from core.ueditor_config import config
from core.utils import qiniu_upload


class UeditorHandler(BaseHandler):
    """ueditor的handler"""

    def get(self, *args, **kwargs):

        action = self.get_argument('action', 'config')

        print('ueditor action: ', action)

        self.write(config)

    def post(self, *args, **kwargs):

        action = self.get_argument('action')

        if action == 'uploadimage':
            f = self.request.files['upfile'][0]
            fn = f.filename
            filename = str(uuid.uuid4())

            url = qiniu_upload(filename, f.body, f.content_type)

            res = {
                'url': url,
                'title': fn,
                'state': 'SUCCESS',
                'orginal': fn,
            }
            self.write(res)
