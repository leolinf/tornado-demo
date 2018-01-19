# !/usr/bin/env python
# -*- coding=utf-8 -*-

import random
import datetime
import time
import redis

from api.models import VerifyCode, User, UserInfo, Demand, ImageCode, Message,\
    Data, AttachmentDownload
import const
from bson import ObjectId
from settings import VERIFY_TIME, VERIFY_COUNT, VERIFYCODE_EXP, REDIS_HOST


class UserManager(object):
    """用户管理"""

    @classmethod
    def get_user_by_weibo(cls, uid):
        """微博用户是否存在"""

        user = User.objects(info__uid=uid).first()
        return user

    @classmethod
    def get_user_by_qq(cls, openid):
        """微博用户是否存在"""

        user = User.objects(info__openid=openid).first()
        return user

    @classmethod
    def get_user_by_username(cls, username):
        """从用户名看用户是否存在"""

        user = User.objects(username=username).first()
        return user

    @classmethod
    def get_user_by_id(cls, u_id):
        """看用户是否存在"""

        user = User.objects.get(id=u_id)
        return user

    @classmethod
    def create_qq_user(cls, openid, detail):
        """创建QQ用户"""

        user = User.create_user(openid, const.DEFAULT_PASSWORD)
        user.info = UserInfo(openid=openid, detail=detail)
        user.save()
        return user

    @classmethod
    def update_qq_user(cls, openid, detail, user=None):
        """更新QQ用户的授权信息"""

        if user:
            user.info = UserInfo(openid=openid, detail=detail)
            user.save()

    @classmethod
    def update_weibo_user(cls, uid, detail, user=None):
        """更新微博用户的授权信息"""

        if user:
            user.info = UserInfo(uid=uid, detail=detail)
            user.save()

    @classmethod
    def create_weibo_user(cls, uid, detail):
        """创建微博用户"""

        user = User.create_user(uid, const.DEFAULT_PASSWORD)
        user.info = UserInfo(uid=uid, detail=detail)
        user.save()
        return user

    @classmethod
    def create_normal_user(cls, username, password):
        """创建一般用户
        这里的username并不是真正的username，
        是电话号码或者邮箱"""

        user = User.create_user(username, password)
        return user

    @classmethod
    def set_password(cls, username, password):
        """修改用户密码
        这里的username并不是真正的username，
        是电话号码或者邮箱"""

        user = User.objects.get(username=username)
        user.set_password(password)

    @classmethod
    def set_info(cls, u_id, **kwargs):
        """修改基本信息"""

        d = {}
        for k, v in kwargs.items():
            d['set__'+k] = v

        cls.get_user_by_id(u_id).update(**d)

    @classmethod
    def add_favorite(cls, u_id, data_id):
        """添加收藏"""

        if isinstance(data_id, unicode):
            data_id = ObjectId(data_id)

        cls.get_user_by_id(u_id).update(
            add_to_set__favorite=data_id)

    @classmethod
    def remove_favorite(cls, u_id, data_id):
        """取消收藏"""

        if isinstance(data_id, unicode):
            data_id = ObjectId(data_id)

        cls.get_user_by_id(u_id).update(
            pull__favorite=data_id)

    @classmethod
    def get_favorite(cls, u_id):
        """获取我的收藏"""

        return cls.get_user_by_id(u_id).favorite

    @classmethod
    def get_user_list(cls, **kwargs):
        """获取用户列表"""

        return User.objects(**kwargs).order_by('-date_joined')

    @classmethod
    def edit_user_status(cls, user_lst, is_active):
        """修改用户状态"""

        User.objects(id__in=user_lst).update(
            multi=True,
            is_active=is_active,
        )

    @classmethod
    def is_super_mng(cls, u_id):
        """判断是不是超级管理员"""

        return bool(User.objects(id=u_id, username=const.SUPERMNG))


class VerifyCodeManager(object):
    """验证码管理"""

    @classmethod
    def get_verify_code(cls, username, verify_type=None):
        """获取一个验证码"""

        # 注册过了
        if (verify_type == const.VERIFY_REG
                and UserManager.get_user_by_username(username)):
            return 'exists'

        v = VerifyCode.objects(username=username).first()

        # 第一次生成验证码
        if not v:
            return cls.set_verify_code(username)

        # 发送时间间隔太短
        if (datetime.datetime.now() - v.create_time
                < datetime.timedelta(seconds=VERIFY_TIME)):
            return 'quick'

        # 当天发送次数超过限制
        if (v.create_time.date() == datetime.date.today()
                and v.count >= VERIFY_COUNT):
            return 'tomorrow'

        return cls.update_verify_code(v)

    @classmethod
    def set_verify_code(cls, username):
        """生成验证码"""

        verifycode = str(random.randint(100000, 999999))

        VerifyCode.objects(username=username).update_one(
            upsert=True, set__username=username, set__verifycode=verifycode,
            set__create_time=datetime.datetime.now()
        )
        return verifycode

    @classmethod
    def update_verify_code(cls, v):
        """更新验证码"""

        ex_time = v.create_time
        # 上次是今天发的
        if ex_time.date() == datetime.date.today():
            v.count += 1
        else:
            v.count = 1

        verifycode = str(random.randint(100000, 999999))
        v.verifycode = verifycode
        v.create_time = datetime.datetime.now()
        v.save()
        return verifycode

    @classmethod
    def check_verify_code(cls, username, code):
        """核对验证码"""

        verify = VerifyCode.objects(username=username).first()

        if verify is None:
            return False

        # 过期
        if int(time.time()) - int(verify.create_time.strftime('%s')) \
                > VERIFYCODE_EXP:
            return False

        # 通过了就删除掉
        if code == verify.verifycode:
            verify.delete()
            return True
        else:
            return False


class DemandManager(object):
    """需求管理"""

    @classmethod
    def add_demand(cls, u_id, **kwargs):

        if isinstance(u_id, unicode):
            u_id = ObjectId(u_id)

        return Demand(user_id=u_id, **kwargs).save()

    @classmethod
    def get_demands_by_user(cls, u_id, **kwargs):

        return Demand.objects(
            user_id=u_id, __raw__=kwargs).order_by('-create_time')

    @classmethod
    def get_demand_by_id(cls, demand_id):

        return Demand.objects.get(id=demand_id)

    @classmethod
    def review_demand(cls, demand_id, review_status, review_content=''):
        """更改审核状态"""

        demand = Demand.objects.get(id=demand_id)
        # 通过
        if (review_status == const.REVIEW_SUCCESS
                and demand.review_status == const.WAIT_REVIEW):
            demand.update(
                set__review_status=review_status,
                set__release_time=datetime.datetime.now(),
            )
        # 不通过
        elif review_status == const.REVIEW_REJECT and demand.review_status == const.WAIT_REVIEW:
            demand.update(
                set__review_status=review_status,
                set__review_content=review_content,
            )
        # 下线
        elif review_status == const.OFFLINE and demand.review_status in [const.SOLVED, const.REVIEW_SUCCESS]:
            demand.update(
                set__review_status=review_status,
            )
        # 解决
        elif review_status == const.SOLVED and demand.review_status == const.REVIEW_SUCCESS:
            demand.update(
                set__review_status=review_status,
            )
        else:
            return
        return demand

    @classmethod
    def operate_demand(cls, demand_lst, review_status):
        """更改状态"""

        demand = Demand.objects(id__in=demand_lst)

        # 发布的才能解决
        if review_status == const.SOLVED and not all(d.review_status == const.REVIEW_SUCCESS for d in demand):
            return
        # 发布或者解决的才能下线
        if review_status == const.OFFLINE and not all(d.review_status in [const.REVIEW_SUCCESS, const.REVIEW_REJECT, const.WAIT_REVIEW] for d in demand):
            return

        demand.update(
            set__review_status=review_status,
        )
        return demand

    @classmethod
    def get_demand_list(cls, username='', title='', order=None, **kwargs):
        """获取需求列表"""

        review_status = kwargs.get('review_status')
        if review_status == const.DEMAND_LIST:
            kwargs.pop('review_status')
            demands = Demand.objects(
                review_status__in=[const.REVIEW_SUCCESS, const.SOLVED], **kwargs)
        else:
            demands = Demand.objects(**kwargs)

        if username is not '':
            user_ids = User.objects(username__contains=username).distinct('id')
            demands = demands.filter(user_id__in=user_ids)

        if title is not '':
            demands = demands.filter(title__contains=title)

        if order is not None:
            demands = demands.order_by(const.ORDER[order])
        else:
            demands = demands.order_by('-create_time')

        return demands

    @classmethod
    def update_demand(cls, demand_id, **kwargs):
        """更新需求"""

        d = {}
        for k, v in kwargs.items():
            d['set__'+k] = v

        demand = Demand.objects.get(id=demand_id)

        # 只有被驳回的才能编辑
        if demand.review_status != const.REVIEW_REJECT:
            return

        demand.update(**d)

        return demand

    @classmethod
    def offline_demand(cls, demand_id):

        Demand.objects(id=demand_id).update(set__review_status=const.OFFLINE)


class ImageCodeManager(object):
    """图片验证码管理"""

    @classmethod
    def set_imagecode(cls, key, code):
        """生成图片二维码"""

        ImageCode.objects(key=key).update_one(
            upsert=True,
            set__key=key,
            set__code=code,
        )

    @classmethod
    def check_imagecode(cls, key, code):
        """校验图片二维码"""

        return ImageCode.objects(key=key, code=code.lower())


class MessageManager(object):
    """消息管理"""

    @classmethod
    def send_message(cls, msg_type, user_lst, content, user_id, pre_msg_id='', doc_id=''):
        """发消息"""

        y = lambda x: ObjectId(x) if isinstance(x, unicode) else x
        users = map(y, user_lst)
        if isinstance(user_id, unicode):
            user_id = ObjectId(user_id)

        if isinstance(pre_msg_id, unicode):
            pre_msg_id = ObjectId(pre_msg_id)

        if pre_msg_id:
            Message(
                msg_type=msg_type,
                user_lst=users,
                content=content,
                user_id=user_id,
                pre_msg_id=pre_msg_id,
                doc_id=doc_id,
            ).save()
            # 标记已回复
            Message.objects.get(id=pre_msg_id).update(
                set__is_replied=1)
        else:
            Message(
                msg_type=msg_type,
                user_lst=users,
                content=content,
                user_id=user_id,
                doc_id=doc_id,
            ).save()

        # 推送
        r = redis.Redis(REDIS_HOST)
        for user_id in user_lst:
            r.publish(str(user_id), 'new_message')

    @classmethod
    def get_message_by_user(cls, user_id, msg_type=const.ALL):
        """获取某人的消息"""

        if isinstance(user_id, unicode):
            user_id = ObjectId(user_id)

        match = {}
        if msg_type in [const.MESSAGE, const.ADVICE]:
            match.update({'msg_type': msg_type})

        return Message.objects(user_lst__contains=user_id, __raw__=match)\
            .order_by('-create_time')

    @classmethod
    def label_as_read(cls, msg_lst, user_id):
        """标记为已读"""

        if isinstance(user_id, unicode):
            user_id = ObjectId(user_id)

        y = lambda x: ObjectId(x) if isinstance(x, unicode) else x
        msg_lst = map(y, msg_lst)

        Message.objects(id__in=msg_lst).update(
            add_to_set__read_lst=user_id,
            multi=True,
        )

    @classmethod
    def delete_msg(cls, msg_lst):
        """批量删除消息"""

        Message.objects(id__in=msg_lst).delete()

    @classmethod
    def get_message_by_id(cls, m_id):
        """按id获取消息"""

        return Message.objects.get(id=m_id)

    @classmethod
    def unread_count(cls, user_id):
        """未读消息的数量"""

        return Message.objects(
            user_lst__contains=user_id, read_lst__icontains=user_id).count()


class DataManager(object):
    """数据管理"""

    @classmethod
    def review_data(cls, data_id, review_status, review_content=''):
        """更改审核状态"""

        data = Data.objects.get(id=data_id)
        if review_status == const.REVIEW_SUCCESS and data.review_status == const.WAIT_REVIEW:
            data.update(
                set__review_status=review_status,
                set__release_time=datetime.datetime.now(),
            )
        elif review_status == const.REVIEW_REJECT and data.review_status == const.WAIT_REVIEW:
            data.update(
                set__review_status=review_status,
                set__review_content=review_content,
            )
        elif review_status == const.OFFLINE and data.review_status == const.REVIEW_SUCCESS:
            data.update(
                set__review_status=review_status,
            )
        else:
            return
        return data

    @classmethod
    def operate_data(cls, data_lst, review_status):
        """更改审核状态"""

        data = Data.objects(id__in=data_lst)

        if not all(d.review_status in [const.REVIEW_SUCCESS, const.REVIEW_REJECT, const.WAIT_REVIEW] for d in data):
            return

        data.update(
            set__review_status=review_status,
        )
        return data

    @classmethod
    def get_data_list(cls, limit=None, username=None, order=None, **kwargs):
        """获取数据列表"""

        datas = Data.objects(**kwargs)

        if username:
            user_ids = User.objects(username__contains=username).distinct('id')
            datas = datas.filter(user_id__in=user_ids)

        if limit:
            datas = datas.limit(limit)

        if order == const.ORDER_INDEX:
            datas = datas.order_by('comefrom', '-create_time', '-hits')
        elif order == const.ORDER_LATEST:
            datas = datas.order_by('-create_time', 'comefrom', '-hits')
        elif order == const.ORDER_HOT:
            datas = datas.order_by('-hits', '-create_time')
        elif order == const.ORDER_EXCLUSIVE:
            datas = datas.order_by('comefrom', '-hits', '-create_time')
        else:
            datas = datas.order_by('comefrom', '-create_time', '-hits')
        return datas

    @classmethod
    def get_data_by_id(cls, data_id):
        """获取数据"""

        return Data.objects.get(id=data_id)

    @classmethod
    def update_hits(cls, data_id):

        Data.objects.get(id=data_id).update(
            inc__hits=1)

    @classmethod
    def add_data(cls, **kwargs):
        """发布数据"""

        data = Data(**kwargs).save()
        data.save()

        # 推送
        r = redis.Redis(REDIS_HOST)
        r.publish('data', 'new_data')
        return data

    @classmethod
    def latest_update_date(cls):
        """获取最新发布数据的日期"""

        return Data.objects(review_status=const.REVIEW_SUCCESS).order_by('-create_time')\
            .limit(1).first().create_time.date()

    @classmethod
    def someday_update(cls, date=None):
        """某日更新的数据"""

        if not date:
            date = cls.latest_update_date()

        end = date + datetime.timedelta(days=1)
        return Data.objects(
            create_time__gte=date,
            create_time__lt=end,
            review_status=const.REVIEW_SUCCESS)

    @classmethod
    def update_data(cls, data_id, is_mng=0, **kwargs):
        """修改数据"""

        d = {}
        for k, v in kwargs.items():
            d['set__'+k] = v

        data = Data.objects.get(id=data_id)

        # 被驳回的才能重新编辑
        if data.review_status != const.REVIEW_REJECT and is_mng == 0:
            return

        d.update({'set__last_update': datetime.datetime.now()})

        data.update(**d)

        return data

    @classmethod
    def get_data_for_favorlist(cls, data_ids, start=0, count=10):
        """为获取收藏列表提供"""

        data = Data.objects(id__in=data_ids).skip(start).limit(count)
        return data

    @classmethod
    def get_hot_down(cls, start=0, count=10):
        """获取下载排行"""

        datas = Data.objects(
            review_status=const.REVIEW_SUCCESS).order_by('-attachmentDown')
        return datas.skip(start).limit(count)

    @classmethod
    def get_hot_hit(cls, start=0, count=10):
        """获取点击排行"""

        datas = Data.objects(
            review_status=const.REVIEW_SUCCESS).order_by('-hits')
        return datas.skip(start).limit(count)

    @classmethod
    def offline_data(cls, data_id):
        """下线数据"""

        Data.objects(id=data_id).update(set__review_status=const.OFFLINE)

    @classmethod
    def update_down(cls, data_id):
        """统计下载"""

        Data.objects(id=data_id).update(inc__attachmentDown=1)


class AttachmentManager(object):
    """附件管理"""

    @classmethod
    def record_download(cls, u_id, attachment):
        """记录附件下载"""

        now = datetime.datetime.now()

        data = Data.objects(attachment=attachment).first()

        AttachmentDownload(
            down_time=now,
            user_id=ObjectId(u_id),
            title=data.title,
            category=data.category,
            data_id=data.id,
            attachment=attachment,
        ).save()

    @classmethod
    def get_history_by_uid(cls, u_id, start=0, count=10, **kwargs):
        """获取用户的下载历史"""

        ads = AttachmentDownload.objects(
            user_id=u_id, __raw__=kwargs).skip(start).limit(count)
        return ads
