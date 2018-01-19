#!/usr/bin/env python
# -*- coding=utf-8 -*-

import datetime
import bcrypt
import tornado.escape

from mongoengine import Document, IntField, connect, StringField,\
    DateTimeField, ObjectIdField, NotUniqueError,\
    ListField, EmbeddedDocument, EmbeddedDocumentField, DictField,\
    LongField, BooleanField
from settings import MONGODB_HOST, MONGODB_NAME
import const

try:
    from settings import MONGODB_USER, MONGODB_PWD, MONGODB_PORT, MONGODB_AUTH
    connect(
        MONGODB_NAME, host=MONGODB_HOST, username=MONGODB_USER,
        password=MONGODB_PWD, port=MONGODB_PORT,
        authentication_source=MONGODB_AUTH)

except:
    connect(MONGODB_NAME, host=MONGODB_HOST)


class Data(Document):
    """爬取到的数据"""

    # 标题
    title = StringField()
    # 分类
    category = IntField()
    # 点击量
    hits = IntField(default=0)
    # 审核状态 0/3 未通过/通过
    review_status = IntField(default=const.REVIEW_SUCCESS)
    # 审核理由
    review_content = StringField()
    # 数据类型
    data_type = IntField(default=0)
    # 创建时间时间
    create_time = DateTimeField(default=datetime.datetime.now)
    # 发布时间
    release_time = DateTimeField()
    # 作者
    author = StringField()
    # 简介
    intro = StringField()
    # 来源(或者发布数据的联系人)
    source = StringField()
    # 原文链接
    source_url = StringField()
    # 大小
    # dsize = FloatField(default=0)
    dsize = LongField(default=0)
    # 标价 0/1/2/3 收费/免费/面议/未知
    price = IntField(default=3)
    # 价格
    cost = StringField()
    # 详情
    detail = StringField()
    # 联系方式
    contact = StringField()
    # 关联发布用户
    user_id = ObjectIdField()
    # 0/1/2 我们自己的数据/别人的数据/发布的
    comefrom = IntField(default=1)
    # api数据的条数
    rows = IntField(default=0)
    # api数据的接口信息
    interface = StringField()
    # api数据的样本
    sample = StringField()
    # 爬取到的数据分类
    classify = StringField()
    # 二级分类
    secondCategory = IntField()
    # 三级分类
    thirdCategory = IntField()
    # 附件
    attachment = StringField()
    # 标签 列表里面是对象,这样才能被elasticsearch筛选
    tags = ListField()
    # 是否是样本
    isSampleAttachment = IntField(default=1)
    # 附件大小
    attachmentSize = IntField()
    # 附件文件名
    attachmentName = StringField()
    # 附件下载量
    attachmentDown = IntField(default=0)
    # 最后更新时间
    last_update = DateTimeField()
    # 是否有附件 0/1 没有/有
    hasAttachment = IntField(default=0)
    # 单位 0/1/2 元/条 元 元起
    units = IntField(default=1)
    # 精品数据
    qualitydata = BooleanField(default=False)

    def save(self, *args, **kwargs):
        """改写save函数，自动保存create_time"""

        if not self.create_time:
            self.create_time = datetime.datetime.now()

        return super(Data, self).save(*args, **kwargs)

    def get_detail(self):
        """详情"""

        res = {
            'id': str(self.id),
            'title': self.title,
            'category': self.category,
            'dataFormat': self.data_type,
            'releaseTime': int(self.release_time.strftime('%s')) if self.release_time else '',
            'intro': self.intro,
            'linkman': self.source,
            'sourceUrl': self.source_url,
            'dataSize': round(self.dsize, 6),
            'priceType': self.price,
            'detail': self.detail,
            'contact': self.contact,
            'sample': self.sample,
            'interface': self.interface,
            'rows': self.rows,
            'cost': self.cost,
            'comeFrom': self.comefrom,
            'attachmentDown': self.attachmentDown,
            'attachmentSize': self.attachmentSize,
            'attachmentName': self.attachmentName,
            'attachment': self.attachment,
            'secondCategory': self.secondCategory,
            'thirdCategory': self.thirdCategory,
            'hits': self.hits,
            'isSampleAttachment': self.isSampleAttachment,
            'tags': self.tags,
            'reviewContent': self.review_content,
            'hasAttachment': self.hasAttachment,
            'reviewContent': self.review_content,
            'units': self.units,
            'isQuality': self.qualitydata,
        }
        d = {'displayType': -1}

        for i in const.SOURCE_URL:
            if self.source_url and self.source_url.startswith(i):
                d = {'displayType': const.SOURCE_URL[i]}
                break

        res.update(d)
        return res

    def get_index(self):
        """首页接口合集"""

        res = {
            'attachmentDown': self.attachmentDown,
            'id': str(self.id),
            'title': self.title,
            'hits': self.hits,
            'isQuality': self.qualitydata,
        }
        return res

    def get_hot_json(self):
        """热门数据的返回"""

        res = {
            'id': str(self.id),
            'title': self.title,
        }
        return res

    def get_list(self):
        """筛选结果列表的返回"""

        res = {
            'id': str(self.id),
            'title': self.title,
            'category': self.category,
            'dataSize': self.dsize,
            'releaseTime': int(self.release_time.strftime('%s')) if self.release_time else '',
            'rows': self.rows,
            'comeFrom': self.comefrom,
            'attachmentDown': self.attachmentDown,
            'attachmentSize': self.attachmentSize,
            'hits': self.hits,
            'dataFormat': self.data_type,
            'intro': self.intro,
            'isQuality': self.qualitydata,
        }

        return res

    def get_detail_json(self):
        """详情的返回"""

        res = {
            'id': str(self.id),
            'title': self.title,
            'category': self.category,
            'data_type': self.data_type,
            # 'release_time': self.release_time.strftime('%s'),
            'release_time': self.create_time.strftime('%s'),
            'intro': self.intro,
            'author': self.author,
            'source': self.source,
            'source_url': self.source_url,
            'size': round(self.dsize, 6),
            'price': self.price,
            'detail': self.detail,
            'contact': self.contact,
            'doc_type': const.DOC_DATA,
            'sample': self.sample,
            'interface': self.interface,
            'rows': self.rows,
            'cost': self.cost,
            'review_status': self.review_status,
            'comefrom': self.comefrom,
            'attachmentDown': self.attachmentDown,
            'attachmentSize': self.attachmentSize,
            'attachmentName': self.attachmentName,
            'attachment': self.attachment,
            'secondCategory': self.secondCategory,
            'thirdCategory': self.thirdCategory,
            'hits': self.hits,
            'isSampleAttachment': self.isSampleAttachment,
            'tags': self.tags,
            'review_content': self.review_content,
        }

        d = {'display_type': -1}

        for i in const.SOURCE_URL:
            if self.source_url and self.source_url.startswith(i):
                d = {'display_type': const.SOURCE_URL[i]}
                break

        res.update(d)

        if self.user_id:
            res.update({
                'userinfo': User.objects.get(id=self.user_id).get_basic_info()
            })

        # 如果下线了就不给联系方式
        if self.review_status == const.OFFLINE:
            res.update({'contact': ''})

        return res

    def get_mng_detail_json(self):
        """详情的返回"""

        res = {
            'id': str(self.id),
            'title': self.title,
            'category': self.category,
            'data_type': self.data_type,
            # 'release_time': self.release_time.strftime('%s'),
            'release_time': self.create_time.strftime('%s'),
            'intro': self.intro,
            'author': self.author,
            'source': self.source,
            'source_url': self.source_url,
            'size': round(self.dsize, 6),
            'price': self.price,
            'detail': self.detail,
            'contact': self.contact,
            'doc_type': const.DOC_DATA,
            'sample': self.sample,
            'interface': self.interface,
            'rows': self.rows,
            'cost': self.cost,
            'review_status': self.review_status,
            'comefrom': self.comefrom,
            'hits': self.hits,
            'attachmentDown': self.attachmentDown,
            'attachmentSize': self.attachmentSize,
            'attachmentName': self.attachmentName,
            'attachment': self.attachment,
            'secondCategory': self.secondCategory,
            'thirdCategory': self.thirdCategory,
            'isSampleAttachment': self.isSampleAttachment,
            'tags': self.tags,
            'review_content': self.review_content,
        }

        d = {'display_type': -1}

        for i in const.SOURCE_URL:
            if self.source_url and self.source_url.startswith(i):
                d = {'display_type': const.SOURCE_URL[i]}
                break

        res.update(d)

        if self.user_id:
            res.update({
                'userinfo': User.objects.get(id=self.user_id).get_basic_info()
            })

        return res

    def get_intro_json(self):
        """没有登陆的详情返回"""

        res = {
            'id': str(self.id),
            'title': self.title,
            'category': self.category,
            'data_type': self.data_type,
            'size': round(self.dsize, 6),
            # 'release_time': self.release_time.strftime('%s'),
            'release_time': self.create_time.strftime('%s'),
            'intro': self.intro,
            'author': self.author,
            'size': round(self.dsize, 6),
            'price': self.price,
            'rows': self.rows,
            'cost': self.cost,
            'detail': self.detail,
            'sample': self.sample,
            'interface': self.interface,
            'comefrom': self.comefrom,
        }

        d = {'display_type': -1}

        for i in const.SOURCE_URL:
            if self.source_url and self.source_url.startswith(i):
                d = {'display_type': const.SOURCE_URL[i]}
                break

        res.update(d)

        return res

    def get_favorite_json(self):
        """收藏列表用"""

        res = {
            'isRemoved': 0,
            'id': str(self.id),
            'title': self.title,
            'category': self.category,
            'dataFormat': self.data_type,
            'releaseTime': self.release_time.strftime('%s'),
        }
        if self.review_status != const.REVIEW_SUCCESS:
            res['isRemoved'] = 1
        return res

    def get_review_json(self):
        """审核列表用"""

        res = {
            'id': str(self.id),
            'title': self.title,
            'createTime': self.create_time.strftime('%s'),
            'reviewStatus': self.review_status,
        }
        return res


class UserInfo(EmbeddedDocument):
    """用户授权信息"""

    # 新浪的uid
    uid = StringField()
    # qq的openid
    openid = StringField()
    # 详情
    detail = DictField()


class User(Document):
    """用户"""

    username = StringField(unique=True)
    password = StringField()
    # 收藏
    favorite = ListField(ObjectIdField())
    # 用户类型 0/1/2 普通用户/管理员/超级管理员
    user_type = IntField(default=const.CUSTOMER)
    # 昵称
    nickname = StringField()
    # 授权信息
    info = EmbeddedDocumentField(UserInfo)
    # 激活状态 1/0 激活/锁定
    is_active = IntField(default=1)
    date_joined = DateTimeField(default=datetime.datetime.now)
    # 公司
    company = StringField()
    # 类型 0/1 个人/公司
    customer_type = IntField(default=0)
    # 联系方式类型 0/1/2/3 手机/座机/QQ/邮箱
    contact_type = IntField()
    contact = StringField()

    def save(self, *args, **kwargs):
        """改写save函数，自动保存create_time"""

        if not self.date_joined:
            self.date_joined = datetime.datetime.now()

        return super(User, self).save(*args, **kwargs)

    @classmethod
    def create_user(cls, username, password):
        """创建用户"""

        if cls.objects(username=username):
            raise NotUniqueError

        pwd = bcrypt.hashpw(tornado.escape.utf8(password), bcrypt.gensalt())

        user = User(username=username, password=pwd).save()
        return user

    def set_password(self, password):
        """修改密码"""

        pwd = bcrypt.hashpw(tornado.escape.utf8(password), bcrypt.gensalt())
        self.password = pwd
        self.save()

    def check_password(self, password):
        """确认密码"""

        pwd = bcrypt.hashpw(
            tornado.escape.utf8(password), tornado.escape.utf8(self.password))
        return pwd == self.password

    def get_basic_info(self):
        """获取基本资料"""

        res = {
            'nickname': self.nickname,
            'contact': self.contact,
            'contactType': self.contact_type,
            'customerType': self.customer_type,
            'company': self.company,
            'username': self.username,
            'createTime': self.date_joined.strftime('%s'),
        }
        return res

    def get_mng_info(self):
        """获取用户管理所需资料"""

        res = {
            'id': str(self.id),
            'nickname': self.nickname,
            'contact': self.contact,
            'contact_type': self.contact_type,
            'customer_type': self.customer_type,
            'company': self.company,
            'is_active': self.is_active,
            'username': self.username,
        }
        return res


class VerifyCode(Document):
    """验证码"""

    username = StringField()
    verifycode = StringField()
    create_time = DateTimeField()
    # 发送次数(每天清零)
    count = IntField(default=1)


class Demand(Document):
    """需求"""

    title = StringField()
    category = IntField()
    intro = StringField()
    user_id = ObjectIdField()
    create_time = DateTimeField(default=datetime.datetime.now)
    release_time = DateTimeField()
    # 审核状态
    review_status = IntField(default=const.WAIT_REVIEW)
    # 审核消息
    review_content = StringField()
    # 人名或者公司名字
    source = StringField()
    # 联系方式
    contact = StringField()
    # 行业
    industry = StringField()
    # 标签
    tags = ListField()
    # 价格
    cost = StringField()
    # 截止日期
    deadline = DateTimeField()
    # 标价 0/1/2/3 收费/免费/面议/未知
    price = IntField(default=3)

    def save(self, *args, **kwargs):
        """改写save函数，自动保存create_time"""

        if not self.create_time:
            self.create_time = datetime.datetime.now()

        return super(Demand, self).save(*args, **kwargs)

    def get_info(self):

        res = {
            'id': str(self.id),
            'title': self.title,
            'releaseTime': self.release_time.strftime('%s') if self.release_time else '',
            'createTime': self.create_time.strftime('%s'),
            'category': self.category,
            'intro': self.intro,
            'contact': self.contact,
            'linkman': self.source,
            'cost': self.cost,
            'deadline': self.deadline.strftime('%s') if self.deadline else '',
            'tags': self.tags,
            'priceType': self.price,
            'reviewStatus': self.review_status,
        }
        return res

    def get_review_json(self):
        """审核列表"""

        res = {
            'id': str(self.id),
            'title': self.title,
            'review_status': self.review_status,
            'create_time': self.create_time.strftime('%s'),
            'category': self.category,
        }

        if self.user_id:
            res.update({
                'username': User.objects.get(id=self.user_id).username
            })
        return res

    def get_detail_json(self):

        res = {
            'id': str(self.id),
            'title': self.title,
            'releaseTime': self.release_time.strftime('%s') if self.release_time else '',
            'category': self.category,
            'intro': self.intro,
            'contact': self.contact,
            'linkman': self.source,
            'cost': self.cost,
            'deadline': self.deadline.strftime('%s') if self.deadline else '',
            'tags': self.tags,
            'priceType': self.price,
            'reviewStatus': self.review_status,
            'reviewContent': self.review_content,
        }
        return res


class ImageCode(Document):
    """图片验证码"""

    key = StringField()
    code = StringField()


class Message(Document):
    """消息类"""

    # 消息类型 0/1 系统消息/意见反馈
    msg_type = IntField()
    # 内容
    content = StringField()
    # 接收用户的列表
    user_lst = ListField(ObjectIdField())
    # 已读用户的列表
    read_lst = ListField(ObjectIdField())
    # 发送时间
    create_time = DateTimeField(default=datetime.datetime.now)
    # 发送人的id
    user_id = ObjectIdField()
    # 上一条消息的id
    pre_msg_id = ObjectIdField()
    # 是否回复  0/1 没有回复/回复了
    is_replied = IntField(default=0)
    # 数据或者定制的ID
    doc_id = ObjectIdField()

    def save(self, *args, **kwargs):
        """改写save函数，自动保存create_time"""

        if not self.create_time:
            self.create_time = datetime.datetime.now()

        return super(Message, self).save(*args, **kwargs)

    def get_json(self):
        """获取动态"""

        user = User.objects.get(id=self.user_id)

        res = {
            'id': str(self.id),
            'msgType': self.msg_type,
            'content': self.content,
            'createTime': self.create_time.strftime('%s'),
            'company': user.company,
            'nickname': user.nickname,
            'contact': user.contact,
            'isReplied': self.is_replied,
            'customerType': user.customer_type,
            'username': user.username,
        }

        if self.pre_msg_id:
            pre_msg = Message.objects(id=self.pre_msg_id).first()
            if pre_msg:
                res.update({'pre_content': pre_msg.content})

        return res


class RetrieveToken(Document):
    """找回密码的token"""

    access_token = StringField()
    username = StringField()
    create_time = DateTimeField()
    # 0/1 没用/用了
    is_used = IntField(default=0)


class AttachmentDownload(Document):
    """附件下载历史"""

    # 下载时间
    down_time = DateTimeField()
    # 下载用户的id
    user_id = ObjectIdField()
    # 数据的标题
    title = StringField()
    # 数据的类型
    category = IntField()
    # 数据的id
    data_id = ObjectIdField()
    # 数据的附件
    attachment = StringField()

    def get_detail(self):

        res = {
            'title': self.title,
            'id': str(self.data_id),
            'category': self.category,
            'downTime': self.down_time.strftime('%s'),
        }
        return res
