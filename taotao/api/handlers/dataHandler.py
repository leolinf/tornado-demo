# -*- coding: utf-8 -*-

from mongoengine import DoesNotExist, ValidationError
import tornado.gen

from base.handler import RedisCacheHandler, BaseHandler
from core.utils import formates
from core.manager import DataManager, UserManager, DemandManager
from api.mixins import DataSearchMixin
from api.models import Data
import const


class BaseDataHandler(BaseHandler, DataSearchMixin):
    """基本的数据请求接口"""

    def get(self, *args, **kwargs):

        arguments = {k: v[0] for k, v in self.request.arguments.items()}

        match = self.get_match(**arguments)
        order = self.get_argument('order', const.ORDER_INDEX)
        count = self.get_argument('count', const.COUNT)
        start = self.get_argument('start', const.START)

        sort = self.get_sort(order)
        result = self.get_result(match, sort, start, count)
        keywords = self.get_keyword(arguments.get('content', ''))

        data_list = [
            (i['_source'], i['_id'], i['_score'])
            for i in result['hits']['hits']]
        data_list = map(formates, data_list)

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
            'data': {
                'total': result['hits']['total'],
                'dataList': data_list,
                'keywords': keywords,
            }
        }

        self.write(res)


class IndexHandler(RedisCacheHandler):
    """首页的几个接口集合"""

    @tornado.gen.coroutine
    def get(self, *args, **kwargs):

        print 'debug:::feefe'
        hotdown = DataManager.get_hot_down()
        hothit = DataManager.get_hot_hit()
        last_update = DataManager.latest_update_date()
        updates = DataManager.someday_update()

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
            'data': {
                'attachmentRank': [i.get_index() for i in hotdown],
                'hotRank': [i.get_index() for i in hothit],
                'lastUpdateDataNum': len(updates),
                'lastUpdateTime': int(last_update.strftime('%s')),
                'dataGather': Data.objects(
                    review_status=const.REVIEW_SUCCESS).count(),
                'dataTotal': const.DATATOTAL,
            }
        }
        self.write(res)


class ExclusiveDataHandler(BaseHandler, DataSearchMixin):
    """独家数据列表"""

    def get(self):

        count = self.get_argument('count', const.COUNT)
        start = self.get_argument('start', const.START)
        match = self.get_match(
            start=start, count=count, comefrom=const.FROMUS,
            review_status=const.REVIEW_SUCCESS)
        order = const.ORDER_EXCLUSIVE

        sort = self.get_sort(order)
        result = self.get_result(match, sort, start, count)

        data_list = [
            (i['_source'], i['_id'], i['_score'])
            for i in result['hits']['hits']]
        data_list = map(formates, data_list)

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
            'data': {
                'total': result['hits']['total'],
                'dataList': data_list,
            }
        }

        self.write(res)


class LatestDataHandler(BaseHandler, DataSearchMixin):
    """最新数据列表"""

    def get(self):

        count = self.get_argument('count', const.COUNT)
        start = self.get_argument('start', const.START)
        match = self.get_match(
            start=start, count=count,
            review_status=const.REVIEW_SUCCESS)
        order = const.ORDER_LATEST

        sort = self.get_sort(order)
        result = self.get_result(match, sort, start, count)

        data_list = [
            (i['_source'], i['_id'], i['_score'])
            for i in result['hits']['hits']]
        data_list = map(formates, data_list)

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
            'data': {
                'total': result['hits']['total'],
                'dataList': data_list,
            }
        }

        self.write(res)


class HotDataHandler(BaseHandler, DataSearchMixin):
    """热门数据列表"""

    def get(self):

        count = self.get_argument('count', const.COUNT)
        start = self.get_argument('start', const.START)
        match = self.get_match(
            start=start, count=count,
            review_status=const.REVIEW_SUCCESS)
        order = const.ORDER_HOT

        sort = self.get_sort(order)
        result = self.get_result(match, sort, start, count)

        data_list = [
            (i['_source'], i['_id'], i['_score'])
            for i in result['hits']['hits']]
        data_list = map(formates, data_list)

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
            'data': {
                'total': result['hits']['total'],
                'dataList': data_list,
            }
        }

        self.write(res)


class AttachmentDataHandler(BaseHandler, DataSearchMixin):
    """附件下载列表"""

    def get(self):

        count = self.get_argument('count', const.COUNT)
        start = self.get_argument('start', const.START)
        match = self.get_match(
            start=start, count=count,
            review_status=const.REVIEW_SUCCESS,
            hasAttachment=1,
        )
        order = const.ORDER_DOWN

        sort = self.get_sort(order)
        result = self.get_result(match, sort, start, count)

        data_list = [
            (i['_source'], i['_id'], i['_score'])
            for i in result['hits']['hits']]
        data_list = map(formates, data_list)

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
            'data': {
                'total': result['hits']['total'],
                'dataList': data_list,
            }
        }

        self.write(res)


class DataDetailHandler(BaseHandler):
    """获取数据详情"""

    def get(self, *args, **kwargs):

        data_id = kwargs.get('dataId')
        countFlag = self.get_argument('countFlag', 0)
        try:
            data = DataManager.get_data_by_id(data_id)
        except DoesNotExist:
            self.raise_error(const.NOT_EXISTS)
            return
        except ValidationError:
            self.raise_error(const.INVALID_ID)
            return

        if data.review_status == const.OFFLINE:
            self.set_status(404)
            self.finish()

        d = data.get_detail()
        flag = 0

        # 判断是否登陆
        try:
            token = self.request.headers.get('token')
        except ValueError:
            flag = 0
        else:
            # 解析token
            token_data = self.parse_token(token)

            if not token_data:
                # 过期或者什么原因token无效
                flag = 0
            elif token_data['userType'] == const.CUSTOMER:
                flag = 1
            elif token_data['userType'] == const.MANAGER:
                flag = 2
            elif token_data['userType'] == const.SUPERUSER:
                flag = 3

        # 增加判断是否已经收藏
        if flag:
            user_id = token_data.get('userId', '')
            if data.id in UserManager.get_user_by_id(user_id).favorite:
                d.update({'isFavored': const.FAVOR_Y})
            else:
                d.update({'isFavored': const.FAVOR_N})

        if countFlag:
            DataManager.update_hits(data_id)

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
            'data': d,
        }
        self.write(res)


class SearchDataHandler(BaseHandler, DataSearchMixin):
    """搜索数据接口"""

    def get(self):

        count = self.get_argument('count', const.COUNT)
        start = self.get_argument('start', const.START)

        arguments = {k: v[0] for k, v in self.request.arguments.items()}

        match = self.get_match(
            review_status=const.REVIEW_SUCCESS, **arguments)
        print('match:\t{0}'.format(match))
        order = self.get_argument('order', const.ORDER_INDEX)

        sort = self.get_sort(order)
        result = self.get_result(match, sort, start, count)
        keywords = self.get_keyword(self.get_argument('content', ''))

        data_list = [
            (i['_source'], i['_id'], i['_score']) for i in result['hits']['hits']]
        data_list = map(formates, data_list)

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
            'data': {
                'total': result['hits']['total'],
                'dataList': data_list,
                'keywords': keywords,
            }
        }

        self.write(res)


class CategoryDataHandler(BaseHandler):
    """不同分类的数据量"""

    def get(self):

        data_list = [
            {
                'category': i,
                'total': Data.objects(
                    review_status=const.REVIEW_SUCCESS, category=i).count()
            }
            for i in range(1, 9)
        ]

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
            'data': {'dataList': data_list},
        }
        self.write(res)


class DemandListHandler(BaseHandler):
    """需求列表"""

    def get(self, *args, **kwargs):

        start = int(self.get_argument('start', const.START))
        count = int(self.get_argument('count', const.COUNT))

        category = int(self.get_argument('category', const.ALL))
        username = self.get_argument('username', '')
        title = self.get_argument('title', '')
        match = self.get_match(category, const.REVIEW_SUCCESS)

        demand_lst = []
        demands = DemandManager.get_demand_list(
            username=username, title=title, **match)
        total = demands.count()

        for i in demands.skip(start).limit(count):
            demand_lst.append(i.get_info())

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
            'data': {
                'demandList': demand_lst,
                'total': total,
            },
        }
        self.write(res)

    def get_match(self, category, review_status):
        match = {}

        if review_status != const.ALL:
            match.update({'review_status': review_status})

        if category != const.ALL:
            match.update({'category': category})

        return match


class DemandDetailHandler(BaseHandler):
    """需求详情"""

    def get(self, *args, **kwargs):

        demandId = kwargs.get('demandId')

        try:
            demand = DemandManager.get_demand_by_id(demandId)
        except:
            self.raise_error(const.INVALID_ID)
            return
        if demand.review_status == const.OFFLINE:
            self.set_status(404)
            self.finish()

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
            'data': demand.get_detail_json(),
        }
        self.write(res)


class QualityDataHandler(BaseHandler):
    """精品数据列表"""

    def get(self):

        c = int(self.get_argument('category', 1))
        count = int(self.get_argument('count', const.COUNT))
        start = int(self.get_argument('start', const.START))

        if c < 1000:
            datas = DataManager.get_data_list(
                qualitydata=True, category=c).skip(start).limit(count)
        elif 1000 <= c < 999999:
            datas = DataManager.get_data_list(
                qualitydata=True, secondCategory=c).skip(start).limit(count)
        else:
            datas = DataManager.get_data_list(
                qualitydata=True, thirdCategory=c).skip(start).limit(count)

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
            'data': {
                'dataList': [i.get_detail() for i in datas],
                'total': datas.count(),
            },
        }
        self.write(res)
