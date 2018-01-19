# -*- coding: utf-8 -*-

"""
用户操作部分
"""

from bson import ObjectId
import datetime

from base.handler import BaseHandler
from core.manager import UserManager, DataManager, AttachmentManager,\
    MessageManager, DemandManager
from core.auth import login_required, validate_password
from api.models import User
from mongoengine import ValidationError, DoesNotExist
import const


class ResetPwdHandler(BaseHandler):
    """修改密码接口"""

    @login_required([const.CUSTOMER, const.MANAGER])
    def post(self, *args, **kwargs):

        user_id = self.token_data.get('userId', '')
        user = UserManager.get_user_by_id(user_id)
        try:
            orig_password = self.parse_body('passwordOrig', '')
            password = self.parse_body('password', '')
            password_confirm = self.parse_body('passwordConfirm', '')
            if not validate_password(password):
                raise ValueError
        except ValueError:
            self.raise_error(const.INVALID_TYPE)
            return

        # 两次密码不一样
        if password != password_confirm or not password:
            self.raise_error(const.NOT_MATCH)
            return

        # 账号密码不对
        if not user.check_password(orig_password):
            self.raise_error(const.INVALID_USER)
            return

        user.set_password(password)

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
        }
        self.write(res)


class InfoHandler(BaseHandler):
    """用户基本资料"""

    @login_required([const.CUSTOMER])
    def post(self, *args, **kwargs):
        """更新"""

        u_id = self.token_data.get('userId')
        try:
            nickname = self.parse_body('nickname', '')
            company = self.parse_body('company', '')
            customer_type = self.parse_body('customerType', 0)
            contact = self.parse_body('contact', '')
            contact_type = self.parse_body('contactType', 1)
        except ValueError:
            self.raise_error(const.INVALID_TYPE)
            return

        try:
            UserManager.set_info(
                u_id, nickname=nickname, company=company, contact=contact,
                customer_type=customer_type, contact_type=contact_type,)
        except ValidationError:
            self.raise_error(const.INVALID_TYPE)
            return
        except DoesNotExist:
            self.raise_error(const.INVALID_ID)
            return

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
        }
        self.write(res)

    @login_required([const.CUSTOMER])
    def get(self, *args, **kwargs):
        """获取"""

        u_id = self.token_data.get('userId')
        try:
            user = UserManager.get_user_by_id(u_id)
        except ValidationError:
            self.raise_error(const.INVALID_ID)
            return
        except DoesNotExist:
            self.raise_error(const.NOT_EXISTS)
            return

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
            'data': {'userInfo': user.get_basic_info()},
        }
        self.write(res)


class FavoriteHandler(BaseHandler):
    """收藏"""

    @login_required([const.CUSTOMER])
    def post(self, *args, **kwargs):
        """添加取消收藏"""

        u_id = self.token_data.get('userId')
        try:
            data_id = self.parse_body('dataId')
            add = self.parse_body('favor', const.FAVOR_Y)
        except ValueError:
            self.raise_error(const.INVALID_TYPE)
            return

        if not add:
            UserManager.remove_favorite(u_id, data_id)
        else:
            UserManager.add_favorite(u_id, data_id)

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
        }
        self.write(res)

    @login_required([const.CUSTOMER])
    def get(self, *args, **kwargs):
        """我的收藏"""

        u_id = self.token_data.get('userId')

        start = int(self.get_argument('start', const.START))
        count = int(self.get_argument('count', const.COUNT))

        data_lst = []
        data_ids = UserManager.get_favorite(u_id)

        datas = DataManager.get_data_for_favorlist(data_ids, start, count)
        total = datas.count()
        data_lst = [i.get_favorite_json() for i in datas]

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
            'data': {
                'dataList': data_lst, 'total': total
            },
        }
        self.write(res)


class AttachmentHistoryHandler(BaseHandler):
    """下载历史"""

    @login_required([const.CUSTOMER])
    def get(self, *args, **kwargs):

        u_id = self.token_data.get('userId', '')

        start = int(self.get_argument('start', const.START))
        count = int(self.get_argument('count', const.COUNT))
        category = int(self.get_argument('category', 0))

        match = {}
        total_download = AttachmentManager.get_history_by_uid(u_id).count()
        if category:
            match.update({'category': category})

        ads = AttachmentManager.get_history_by_uid(u_id, start, count)

        data_list = [i.get_detail() for i in ads]
        total = ads.count()

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
            'data': {
                'total': total,
                'dataList': data_list,
                'totalDownload': total_download,
            }
        }
        self.write(res)


class UserDataHandler(BaseHandler):
    """用户数据"""

    @login_required([const.CUSTOMER])
    def get(self):
        """获取自己发布的数据列表"""

        u_id = self.token_data.get('userId', '')
        start = int(self.get_argument('start', const.START))
        count = int(self.get_argument('count', const.COUNT))
        review_status = int(self.get_argument('reviewStatus', const.ALL))

        match = {
            'user_id': ObjectId(u_id), 'review_status': {'$ne': const.OFFLINE}
        }
        total_release = DataManager.get_data_list(__raw__=match).count()
        if review_status != const.ALL:
            match.update({'review_status': review_status})

        datas = DataManager.get_data_list(__raw__=match)

        total = datas.count()
        datas = datas.skip(start).limit(count)
        data_lst = [i.get_review_json() for i in datas]
        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
            'data': {
                'dataList': data_lst,
                'total': total,
                'totalRelease': total_release,
            },
        }
        self.write(res)

    @login_required([const.CUSTOMER])
    def post(self):
        """发布数据"""

        u_id = self.token_data.get('userId', '')

        try:
            title = self.parse_body('title', '')
            category = self.parse_body('category', 8)
            size = self.parse_body('dataSize', 0)
            price = self.parse_body('priceType', 0)
            rows = self.parse_body('dataRows', 0)
            data_type = self.parse_body('dataFormat', 0)
            source = self.parse_body('linkman', '')
            contact = self.parse_body('contact', '')
            interface = self.parse_body('interface', '')
            sample = self.parse_body('sample', '')
            intro = self.parse_body('intro', '')
            data_id = self.parse_body('dataId', '')
            cost = self.parse_body('cost', '')
            tags = self.parse_body('tags', [])
            attachment = self.parse_body('attachment', '')
            attachmentName = self.parse_body('attachmentName', '')
            attachmentSize = self.parse_body('attachmentSize', 0)
            isSample = self.parse_body('isSample', 0)
            secondCategory = self.parse_body('secondCategory', 0)
            thirdCategory = self.parse_body('thirdCategory', 0)
            units = self.parse_body('units', 0)
        except ValueError:
            self.raise_error(const.INVALID_TYPE)
            return

        # 如果是编辑
        if data_id:
            # 把原来的下线了
            DataManager.offline_data(data_id)

        data = DataManager.add_data(
            title=title, category=category, dsize=size,
            price=price, data_type=data_type,
            intro=intro, user_id=ObjectId(u_id),
            interface=interface, review_status=const.WAIT_REVIEW,
            source=source, contact=contact, sample=sample, rows=rows,
            comefrom=const.FROMPUB, attachment=attachment,
            tags=tags, cost=cost, attachmentName=attachmentName,
            attachmentSize=attachmentSize,
            isSampleAttachment=isSample, secondCategory=secondCategory,
            thirdCategory=thirdCategory, units=units
        )

        # 给超级管理员发送消息
        content = const.MSG_WAIT_REVIEW 
        user_lst = [i.id for i in User.objects(user_type=const.SUPERUSER)]
        MessageManager.send_message(const.MESSAGE, user_lst, content, 
                self.token_data.get('userId'), doc_id=data.id)

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
            'data': {'dataId': str(data.id)},
        }
        self.write(res)


class MessageHandler(BaseHandler):
    """动态"""

    @login_required([const.CUSTOMER])
    def get(self, *args, **kwargs):
        """获取消息列表"""

        user_id = self.token_data.get('userId', '')
        start = int(self.get_argument('start', const.START))
        count = int(self.get_argument('count', const.COUNT))
        msg_type = int(self.get_argument('msgType', const.ALL))

        try:
            messages = MessageManager.get_message_by_user(user_id)
        except ValidationError:
            self.raise_error(const.INVALID_TYPE)
            return
        except DoesNotExist:
            self.raise_error(const.NOT_EXISTS)
            return
        total_message = messages.count()

        try:
            messages = MessageManager.get_message_by_user(user_id, msg_type)
        except ValidationError:
            self.raise_error(const.INVALID_TYPE)
            return
        except DoesNotExist:
            self.raise_error(const.NOT_EXISTS)
            return
        total = messages.count()
        unread_total = 0
        messages = messages.skip(start).limit(count)

        msg_lst = []

        for message in messages:
            if ObjectId(user_id) in message.read_lst:
                d = {'read': const.READ_Y}
            else:
                d = {'read': const.READ_N}
                unread_total += 1

            d.update(message.get_json())
            msg_lst.append(d)

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
            'data': {
                'msgList': msg_lst,
                'total': total,
                'unread': unread_total,
                'totalReceive': total_message,
            },
        }
        self.write(res)

    @login_required([const.CUSTOMER])
    def post(self, *args, **kwargs):
        """普通用户发消息"""

        user_id = self.token_data.get('userId', '')
        try:
            content = self.parse_body('content', '')
        except ValueError:
            self.raise_error(const.INVALID_TYPE)
            return

        msg_type = const.ADVICE

        user_lst = User.objects(user_type=const.SUPERUSER).distinct('id')

        MessageManager.send_message(msg_type, user_lst, content, user_id)

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
        }
        self.write(res)


class MessageReadHandler(BaseHandler):
    """消息操作"""

    @login_required([const.CUSTOMER])
    def post(self):
        """标为已读"""

        user_id = self.token_data.get('userId', '')
        try:
            msg_lst = self.parse_body('msgList', [])
        except ValueError:
            self.raise_error(const.INVALID_TYPE)
            return

        if not isinstance(msg_lst, list):
            msg_lst = [msg_lst]

        try:
            MessageManager.label_as_read(msg_lst, user_id)
        except ValidationError:
            self.raise_error(const.INVALID_TYPE)
            return
        except DoesNotExist:
            self.raise_error(const.NOT_EXISTS)
            return

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
        }
        self.write(res)


class MessageDelHandler(BaseHandler):
    """删除消息"""

    @login_required([const.CUSTOMER])
    def post(self):
        """删除消息"""

        try:
            msg_lst = self.parse_body('msgList', '')
        except ValueError:
            self.raise_error(const.INVALID_TYPE)
            return

        if not isinstance(msg_lst, list):
            msg_lst = [msg_lst]

        try:
            MessageManager.delete_msg(msg_lst)
        except ValidationError:
            self.raise_error(const.INVALID_TYPE)
            return
        except DoesNotExist:
            self.raise_error(const.NOT_EXISTS)
            return

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
        }
        self.write(res)


class UserDemandHandler(BaseHandler):
    """需求"""

    @login_required([const.CUSTOMER])
    def post(self, *args, **kwargs):
        """发布需求"""

        u_id = self.token_data.get('userId')
        try:
            title = self.parse_body('title', '')
            category = self.parse_body('category', 8)
            intro = self.parse_body('intro', '')
            contact = self.parse_body('contact', '')
            source = self.parse_body('linkman', '')
            demand_id = self.parse_body('demandId', '')
            tags = self.parse_body('tags', [])
            cost = self.parse_body('cost', '')
            price = self.parse_body('priceType', 3)
            deadline = self.parse_body('deadline', '') or None
        except ValueError:
            self.raise_error(const.INVALID_TYPE)
            return

        if deadline:
            deadline = datetime.datetime.fromtimestamp(deadline)

        if demand_id:
            DemandManager.offline_demand(demand_id)

        demand = DemandManager.add_demand(
            u_id, title=title, category=category, intro=intro,
            contact=contact, source=source, tags=tags,
            cost=cost, deadline=deadline, price=price
        )
        
        content = const.DEIVCE_WAIT_REVIEW
        user_lst = [i.id for i in User.objects(user_type=const.SUPERUSER)]

        MessageManager.send_message(const.MESSAGE, user_lst, content,
            self.token_data.get('userId'), doc_id=demand.id)

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
        }
        self.write(res)

    @login_required([const.CUSTOMER])
    def get(self, *args, **kwargs):
        """我的需求"""

        u_id = self.token_data.get('userId')
        start = int(self.get_argument('start', const.START))
        count = int(self.get_argument('count', const.COUNT))

        review_status = int(self.get_argument('reviewStatus', const.ALL))
        match = self.get_match(review_status)
        demand_lst = []
        total_release = DemandManager.get_demands_by_user(u_id).count()
        demands = DemandManager.get_demands_by_user(u_id, **match)
        total = demands.count()

        for i in demands.skip(start).limit(count):
            demand_lst.append(i.get_info())

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
            'data': {
                'demandList': demand_lst,
                'total': total,
                'totalRelease': total_release,
            },
        }
        self.write(res)

    def get_match(self, review_status):
        match = {'review_status': {'$ne': const.OFFLINE}}

        if review_status != const.ALL:
            match.update({'review_status': review_status})

        return match


class DataOfflineHandler(BaseHandler):
    """用户下线数据"""

    @login_required([const.CUSTOMER])
    def post(self, *args, **kwargs):

        user_id = self.token_data.get('userId', '')

        try:
            data_id = self.parse_body('dataId', '')
        except ValueError:
            self.raise_error(const.INVALID_TYPE)
            return

        try:
            data_id = ObjectId(data_id)
        except:
            self.raise_error(const.INVALID_ID)
            return

        user_datas = DataManager.get_data_list(user_id=user_id).distinct('id')
        if data_id not in user_datas:
            self.raise_error(const.PERMISSION_DENIED)
            return

        data = DataManager.operate_data([data_id], const.OFFLINE)
        if data is None:
            self.raise_error(const.UNABLE_OFFLINE)
            return

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
        }
        self.write(res)


class DemandOfflineHandler(BaseHandler):
    """用户下线需求和解决需求"""

    @login_required([const.CUSTOMER])
    def post(self, *args, **kwargs):

        user_id = self.token_data.get('userId', '')

        try:
            demand_id = self.parse_body('demandId', '')
        except ValueError:
            self.raise_error(const.INVALID_TYPE)
            return

        try:
            demand_id = ObjectId(demand_id)
        except:
            self.raise_error(const.INVALID_ID)
            return

        user_demands = DemandManager.get_demand_list(user_id=user_id) \
            .distinct('id')

        if demand_id not in user_demands:
            self.raise_error(const.PERMISSION_DENIED)
            return

        demand = DemandManager.operate_demand([demand_id], const.OFFLINE)
        if demand is None:
            self.raise_error(const.UNABLE_OFFLINE)
            return

        res = {
            'errorCode': const.SUCCESS,
            'errorMsg': const.MSG[const.SUCCESS],
        }
        self.write(res)
