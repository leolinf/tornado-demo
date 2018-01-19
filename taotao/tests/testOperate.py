# -*- coding: utf-8 -*-

import sys
sys.path.append('../')
import json
import datetime

from tornado.test.util import unittest
import tornado.escape
import bcrypt

from api.models import User, VerifyCode, Data, Message, Demand
from base.test import BaseTestCase
import const


class UserTestCase(BaseTestCase):
    """用户操作"""

    def setUp(self):

        now = datetime.datetime.utcnow()

        self.verifycode = VerifyCode(
            username='15123456789', verifycode='haha',
            create_time=now).save()

        self.data = Data(
            title='haha', release_time=now, data_type=1,
            comefrom=1, price=1).save()
        self.data2 = Data(
            title='hehe', release_time=now, data_type=1,
            comefrom=1, price=1).save()

        pwd = bcrypt.hashpw(tornado.escape.utf8('123456'), bcrypt.gensalt())
        self.user = User(
            username='15123456789',
            password=pwd,
            user_type=const.CUSTOMER,
            favorite=[self.data2.id]
        ).save()

        self.data3 = Data(
            title='hehe', release_time=now, data_type=1,
            comefrom=1, price=1, user_id=self.user.id).save()
        self.demand = Demand(
            title='dsf', user_id=self.user.id,
            review_status=const.REVIEW_SUCCESS).save()
        self.message = Message(
            msg_type=1, content='aaa', user_lst=[self.user.id],
            create_time=now, user_id=self.user.id
        ).save()

        super(UserTestCase, self).setUp()

    def tearDown(self):

        self.user.delete()
        self.verifycode.delete()
        self.data.delete()
        self.data2.delete()
        self.data3.delete()
        self.message.delete()
        self.demand.delete()
        super(UserTestCase, self).tearDown()

    def testResetpwd1(self):
        """修改密码,未登录"""

        data = {
            'passwordOrig': '123456', 'password': '1234',
            'passwordConfirm': '1234'
        }
        resp = self.fetch(
            '/v3/api/user/pwd/change', body=json.dumps(data), method='POST')
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.PERMISSION_DENIED)

    def testResetpwd2(self):
        """修改密码,成功"""

        data = {'username': '15123456789', 'password': '123456'}
        resp = self.fetch(
            '/v3/api/token', method='POST', body=json.dumps(data))
        res = json.loads(resp.body)
        token = res['data']['token']

        data = {
            'passwordOrig': '123456', 'password': '1234',
            'passwordConfirm': '1234'
        }
        resp = self.fetch(
            '/v3/api/user/pwd/change', body=json.dumps(data), method='POST',
            headers={'Token': token}
        )
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)

        user = User.objects.get(username='15123456789')
        pwd = bcrypt.hashpw(
            tornado.escape.utf8('1234'), tornado.escape.utf8(user.password))
        self.assertEqual(user.password, pwd)

    def testResetpwd3(self):
        """修改密码,两次密码不一样"""

        data = {'username': '15123456789', 'password': '123456'}
        resp = self.fetch(
            '/v3/api/token', method='POST', body=json.dumps(data))
        res = json.loads(resp.body)
        token = res['data']['token']

        data = {
            'passwordOrig': '123456', 'password': '1234',
            'passwordConfirm': '123'
        }
        resp = self.fetch(
            '/v3/api/user/pwd/change', body=json.dumps(data), method='POST',
            headers={'Token': token}
        )
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.NOT_MATCH)

    def testInfo1(self):
        """获取基本信息, 成功"""

        data = {'username': '15123456789', 'password': '123456'}
        resp = self.fetch(
            '/v3/api/token', method='POST', body=json.dumps(data))
        res = json.loads(resp.body)
        token = res['data']['token']

        resp = self.fetch('/v3/api/user/info', headers={'Token': token})
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)

    def testInfo2(self):
        """获取基本信息, 未登录"""

        resp = self.fetch('/v3/api/user/info')
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.PERMISSION_DENIED)

    def testInfo3(self):
        """修改基本信息"""

        data = {'username': '15123456789', 'password': '123456'}
        resp = self.fetch(
            '/v3/api/token', method='POST', body=json.dumps(data))
        res = json.loads(resp.body)
        token = res['data']['token']

        data = {'nickname': 'oo', 'customerType': 1}
        resp = self.fetch(
            '/v3/api/user/info', headers={'Token': token}, method='POST',
            body=json.dumps(data)
        )
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)
        user = User.objects.get(username='15123456789')
        self.assertEqual(user.nickname, 'oo')

    def testInfo4(self):
        """修改基本信息, 未登录"""

        data = {'nickname': 'oo', 'customerType': 1}
        resp = self.fetch(
            '/v3/api/user/info', method='POST',
            body=json.dumps(data)
        )
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.PERMISSION_DENIED)

    def testFavor1(self):
        """添加收藏, 未登录"""

        data = {'dataId': str(self.data.id), 'favor': 1}
        resp = self.fetch(
            '/v3/api/user/favorite', method='POST',
            body=json.dumps(data)
        )
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.PERMISSION_DENIED)

    def testFavor2(self):
        """添加收藏, 成功"""

        data = {'username': '15123456789', 'password': '123456'}
        resp = self.fetch(
            '/v3/api/token', method='POST', body=json.dumps(data))
        res = json.loads(resp.body)
        token = res['data']['token']

        data = {'dataId': str(self.data.id), 'favor': 1}
        resp = self.fetch(
            '/v3/api/user/favorite', method='POST',
            body=json.dumps(data), headers={'Token': token}
        )
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)
        user = User.objects(username='15123456789').first()
        self.assertTrue(self.data.id in user.favorite)

    def testFavor3(self):
        """取消收藏, 成功"""

        data = {'username': '15123456789', 'password': '123456'}
        resp = self.fetch(
            '/v3/api/token', method='POST', body=json.dumps(data))
        res = json.loads(resp.body)
        token = res['data']['token']

        data = {'dataId': str(self.data2.id), 'favor': 0}
        resp = self.fetch(
            '/v3/api/user/favorite', method='POST',
            body=json.dumps(data), headers={'Token': token}
        )
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)
        user = User.objects(username='15123456789').first()
        self.assertTrue(self.data2.id not in user.favorite)

    def testFavor4(self):
        """获取收藏列表, 未登录"""

        resp = self.fetch('/v3/api/user/favorite')
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.PERMISSION_DENIED)

    def testFavor5(self):
        """获取收藏列表, 成功"""

        data = {'username': '15123456789', 'password': '123456'}
        resp = self.fetch(
            '/v3/api/token', method='POST', body=json.dumps(data))
        res = json.loads(resp.body)
        token = res['data']['token']

        resp = self.fetch('/v3/api/user/favorite', headers={'Token': token})
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)

    def testDown1(self):
        """获取下载历史列表,未登录"""

        resp = self.fetch('/v3/api/user/attachment')
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.PERMISSION_DENIED)

    def testDown2(self):
        """获取下载历史列表, 成功"""

        data = {'username': '15123456789', 'password': '123456'}
        resp = self.fetch(
            '/v3/api/token', method='POST', body=json.dumps(data))
        res = json.loads(resp.body)
        token = res['data']['token']

        resp = self.fetch('/v3/api/user/attachment', headers={'Token': token})
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)

    def testUserlist(self):
        """获取发布数据列表, 未登录"""

        resp = self.fetch('/v3/api/user/data')
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.PERMISSION_DENIED)

    def testUserlist2(self):
        """获取发布数据列表, 成功"""

        data = {'username': '15123456789', 'password': '123456'}
        resp = self.fetch(
            '/v3/api/token', method='POST', body=json.dumps(data))
        res = json.loads(resp.body)
        token = res['data']['token']

        resp = self.fetch('/v3/api/user/data', headers={'Token': token})
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)

    def testPublishData(self):
        """发布数据, 未登陆"""

        data = {'dataId': str(self.data2.id)}
        resp = self.fetch(
            '/v3/api/user/data', method='POST',
            body=json.dumps(data)
        )
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.PERMISSION_DENIED)

    def testPublishData2(self):
        """新发布数据, 成功"""

        data = {'username': '15123456789', 'password': '123456'}
        resp = self.fetch(
            '/v3/api/token', method='POST', body=json.dumps(data))
        res = json.loads(resp.body)
        token = res['data']['token']

        data = {'dataId': str(self.data2.id)}
        resp = self.fetch(
            '/v3/api/user/data', method='POST',
            body=json.dumps(data), headers={'Token': token}
        )
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)
        new_id = res['data']['dataId']
        Data.objects(id=new_id).delete()

    def testPublishData3(self):
        """编辑数据, 成功"""

        data = {'username': '15123456789', 'password': '123456'}
        resp = self.fetch(
            '/v3/api/token', method='POST', body=json.dumps(data))
        res = json.loads(resp.body)
        token = res['data']['token']

        data = {'dataId': str(self.data2.id)}
        resp = self.fetch(
            '/v3/api/user/data', method='POST',
            body=json.dumps(data), headers={'Token': token}
        )
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)
        new_id = res['data']['dataId']
        # 返回的id是新的id
        self.assertNotEqual(str(self.data2.id), new_id)
        data2 = Data.objects.get(id=self.data2.id)
        # 原来的数据已经下线
        self.assertEqual(data2.review_status, const.OFFLINE)
        Data.objects(id=new_id).delete()

    def testOfflineData(self):
        """下线数据, 未登陆"""

        data = {'dataId': str(self.data2.id)}
        resp = self.fetch(
            '/v3/api/user/data/offline', method='POST',
            body=json.dumps(data)
        )
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.PERMISSION_DENIED)

    def testOfflineData2(self):
        """下线数据, 成功"""

        data = {'username': '15123456789', 'password': '123456'}
        resp = self.fetch(
            '/v3/api/token', method='POST', body=json.dumps(data))
        res = json.loads(resp.body)
        token = res['data']['token']

        data = {'dataId': str(self.data3.id)}
        resp = self.fetch(
            '/v3/api/user/data/offline', method='POST',
            body=json.dumps(data), headers={'Token': token}
        )
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)

    def testmessagelist(self):
        """获取消息列表, 未登录"""

        resp = self.fetch('/v3/api/user/message')
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.PERMISSION_DENIED)

    def testmessagelist2(self):
        """获取消息列表, 成功"""

        data = {'username': '15123456789', 'password': '123456'}
        resp = self.fetch(
            '/v3/api/token', method='POST', body=json.dumps(data))
        res = json.loads(resp.body)
        token = res['data']['token']

        resp = self.fetch('/v3/api/user/message', headers={'Token': token})
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)

    def testmessage(self):
        """发布意见反馈, 未登录"""

        data = {'content': 'oo'}
        resp = self.fetch(
            '/v3/api/user/message', method='POST',
            body=json.dumps(data)
        )
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.PERMISSION_DENIED)

    def testmessage1(self):
        """发布意见反馈, 成功"""

        data = {'username': '15123456789', 'password': '123456'}
        resp = self.fetch(
            '/v3/api/token', method='POST', body=json.dumps(data))
        res = json.loads(resp.body)
        token = res['data']['token']

        data = {'content': 'thisistesting'}
        resp = self.fetch(
            '/v3/api/user/message', method='POST',
            body=json.dumps(data), headers={'Token': token}
        )

        self.assertEqual(res['errorCode'], const.SUCCESS)
        msg = Message.objects(content='thisistesting').first()
        self.assertEqual(msg.msg_type, const.ADVICE)
        msg.delete()

    def testmessageread(self):
        """标记已读, 未登录"""

        data = {'msgList': [str(self.message.id)]}
        resp = self.fetch(
            '/v3/api/user/message/read', method='POST',
            body=json.dumps(data)
        )
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.PERMISSION_DENIED)

    def testmessageread1(self):
        """标记已读, 成功"""

        data = {'username': '15123456789', 'password': '123456'}
        resp = self.fetch(
            '/v3/api/token', method='POST', body=json.dumps(data))
        res = json.loads(resp.body)
        token = res['data']['token']

        data = {'msgList': [str(self.message.id)]}
        resp = self.fetch(
            '/v3/api/user/message/read', method='POST',
            body=json.dumps(data), headers={'Token': token}
        )
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)
        msg = Message.objects(id=self.message.id).first()
        self.assertTrue(self.user.id in msg.read_lst)

    def testmessagedel(self):
        """删除, 未登录"""

        data = {'msgList': [str(self.message.id)]}
        resp = self.fetch(
            '/v3/api/user/message/del', method='POST',
            body=json.dumps(data)
        )
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.PERMISSION_DENIED)

    def testmessagedel1(self):
        """删除, 成功"""

        data = {'username': '15123456789', 'password': '123456'}
        resp = self.fetch(
            '/v3/api/token', method='POST', body=json.dumps(data))
        res = json.loads(resp.body)
        token = res['data']['token']

        data = {'msgList': [str(self.message.id)]}
        resp = self.fetch(
            '/v3/api/user/message/del', method='POST',
            body=json.dumps(data), headers={'Token': token}
        )
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)
        msg = Message.objects(id=self.message.id).first()
        self.assertEqual(msg, None)

    def testPublishDemand(self):
        """发布定制, 未登陆"""

        data = {'title': 'nimeide'}
        resp = self.fetch(
            '/v3/api/user/demand', method='POST',
            body=json.dumps(data)
        )
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.PERMISSION_DENIED)

    def testPublishDemand2(self):
        """新发布定制, 成功"""

        data = {'username': '15123456789', 'password': '123456'}
        resp = self.fetch(
            '/v3/api/token', method='POST', body=json.dumps(data))
        res = json.loads(resp.body)
        token = res['data']['token']

        data = {'title': 'nimeide'}
        resp = self.fetch(
            '/v3/api/user/demand', method='POST',
            body=json.dumps(data), headers={'Token': token}
        )
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)
        Data.objects(title='nimeide').delete()

    def testDemandlist(self):
        """获取发布定制列表, 未登录"""

        resp = self.fetch('/v3/api/user/demand')
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.PERMISSION_DENIED)

    def testDemandlist2(self):
        """获取发布定制列表, 成功"""

        data = {'username': '15123456789', 'password': '123456'}
        resp = self.fetch(
            '/v3/api/token', method='POST', body=json.dumps(data))
        res = json.loads(resp.body)
        token = res['data']['token']

        resp = self.fetch('/v3/api/user/demand', headers={'Token': token})
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)

    def testOfflineDemand(self):
        """下线定制, 未登陆"""

        data = {'dataId': str(self.data2.id)}
        resp = self.fetch(
            '/v3/api/user/demand/offline', method='POST',
            body=json.dumps(data)
        )
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.PERMISSION_DENIED)

    def testOfflineDemand2(self):
        """下线数据, 成功"""

        data = {'username': '15123456789', 'password': '123456'}
        resp = self.fetch(
            '/v3/api/token', method='POST', body=json.dumps(data))
        res = json.loads(resp.body)
        token = res['data']['token']

        data = {'demandId': str(self.demand.id)}
        resp = self.fetch(
            '/v3/api/user/demand/offline', method='POST',
            body=json.dumps(data), headers={'Token': token}
        )
        res = json.loads(resp.body)
        self.assertEqual(res['errorCode'], const.SUCCESS)


if __name__ == '__main__':

    unittest.main()
