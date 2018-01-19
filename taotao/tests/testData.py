# -*- coding: utf-8 -*-

import sys
sys.path.append('../')
import json
import datetime

from tornado.test.util import unittest

from api.models import Data
from base.test import BaseTestCase
import const


class DataListTestCase(BaseTestCase):
    """获取数据列表的接口"""

    def setUp(self):
        self.data = Data(
            title='this is unittest',
            release_time=datetime.datetime.now(),
            data_type=0,
        ).save()
        super(DataListTestCase, self).setUp()

    def testBasicInterface(self):
        """最基本的data的restful接口"""

        resp = self.fetch('/v3/api/data')
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)

    def testExcludeList(self):
        """独家数据列表的接口"""

        resp = self.fetch('/v3/api/data/exclusive')
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)
        comefroms = [i['comeFrom'] for i in res['data']['dataList']]
        # 是否都是独家的
        self.assertListEqual([const.FROMUS] * len(comefroms), comefroms)

    def testLatestList(self):
        """最新数据列表的接口"""

        resp = self.fetch('/v3/api/data/latest')
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)

        release_times = [i['releaseTime'] for i in res['data']['dataList']]
        ordered = sorted(release_times, reverse=True)
        # 是否按发布时间倒序
        self.assertListEqual(release_times, ordered)

    def testHotList(self):
        """热门数据列表的接口"""

        resp = self.fetch('/v3/api/data/hot')
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)

        hits = [i['hits'] for i in res['data']['dataList']]
        ordered = sorted(hits, reverse=True)
        # 是否按发布时间倒序
        self.assertListEqual(hits, ordered)

    def testAttachmentList(self):
        """下载数据列表的接口"""

        resp = self.fetch('/v3/api/data/attachment')
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)

        attachments = [i['attachmentDown'] for i in res['data']['dataList']]
        ordered = sorted(attachments, reverse=True)
        # 是否按发布时间倒序
        self.assertListEqual(attachments, ordered)

    def testDataDetail1(self):
        """数据详情失败"""

        # 不存在
        resp = self.fetch('/v3/api/data/111111111111111111111111/')
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.NOT_EXISTS)

        # id无效
        resp = self.fetch('/v3/api/data/11111111111111111111111/')
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.INVALID_ID)

    def testDataDetail2(self):
        """数据详情成功"""

        resp = self.fetch('/v3/api/data/{0}/'.format(self.data.id))
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)

    def testCategoryList(self):
        """分类数据列表的接口"""

        resp = self.fetch('/v3/api/data/category')
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)

    def tearDown(self):

        Data.objects(title='this is unittest').delete()
        super(DataListTestCase, self).tearDown()


if __name__ == '__main__':

    unittest.main()
