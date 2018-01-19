# -*- coding: utf-8 -*-

import urllib

import qiniu

from base.handler import BaseHandler
from api.models import Data
from core.auth import login_required
from core.manager import AttachmentManager, DataManager
from settings import QINIU_ACCESS_KEY, QINIU_SECRET_KEY, QINIU_BUCKET_NAME_PRI
import const


class PrivateUrlHandler(BaseHandler):
    """获取下载私有文件的临时链接"""

    @login_required([const.CUSTOMER])
    def get(self, *args, **kwargs):

        base_url = self.get_argument('baseUrl', '')
        d = Data.objects(attachment=base_url).first()
        if not d:
            self.raise_error(const.NOT_EXISTS)
            return

        attname = d.attachmentName
        attname = urllib.quote(attname.encode('utf-8'))
        url = base_url + '?attname=' + attname

        q = qiniu.Auth(QINIU_ACCESS_KEY, QINIU_SECRET_KEY)
        private_url = q.private_download_url(url, expires=600)

        # 记录下载
        u_id = self.token_data.get('userId', '')
        AttachmentManager.record_download(u_id, base_url)
        DataManager.update_down(d.id)

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
            'data': {'privateUrl': private_url},
        }
        self.write(res)


class UploadTokenHandler(BaseHandler):
    """获取上传token"""

    def get(self, *args, **kwargs):

        q = qiniu.Auth(QINIU_ACCESS_KEY, QINIU_SECRET_KEY)
        token = q.upload_token(QINIU_BUCKET_NAME_PRI)

        res = {'uptoken': token}

        self.write(res)
