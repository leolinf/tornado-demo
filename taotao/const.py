# -*- coding=utf-8 -*-


class _const:
    class ConstError(TypeError):
        pass

    def __setattr__(self, name, value):
        if name in self.__dict__:
            raise self.ConstError, "Can't rebind const{0}".format(name)

        if not name.isupper():
            raise TypeError("Need to bind uppercase")

        self.__dict__[name] = value

import sys
sys.modules[__name__] = _const()

import const

# 状态码
const.SUCCESS = 10000
const.INVALID_ID = 10001
const.PARAM_MISSING = 10002
const.INVALID_TYPE = 10003
const.ALREADY_EXISTS = 10004
const.INVALID_USER = 10005
const.PERMISSION_DENIED = 10006
const.NOT_MATCH = 10011
const.INVALID_VERIFY_CODE = 10012
const.NEED_REFRESH = 10024
const.NOT_EXISTS = 10030
const.TOO_FREQUENT = 10031
const.WAIT_TOMORROW = 10032
const.USER_BLOCKED = 10033
const.INVALID_IMAGE_CODE = 10034
const.UNKNOWN_ERROR = 20000
const.USER_ERROR = 10040
const.PASSWORD_ERROR = 10041
const.PHONE_ERROR = 10042
const.VALUES_LOSE = 10043
const.VALUES_NULL = 10044
const.SIZE_INVALID_TYPE = 10045
const.TELEPHONE_ERROR = 10046
const.QQ_ERROR = 10047
const.EMAIL_ERROR = 10048
const.UNABLE_REVIEW = 10049
const.UNABLE_EDIT = 10050
const.UNABLE_OFFLINE = 10051
const.USER_EMPTY = 10052
const.COST_ERROR = 10053

const.MSG = {
    const.SUCCESS: 'success',
    const.INVALID_ID: 'invalid id',
    const.INVALID_TYPE: 'invalid type',
    const.ALREADY_EXISTS: 'already exists',
    const.INVALID_USER: 'invalid username or password',
    const.PARAM_MISSING: 'param missing',
    const.PERMISSION_DENIED: 'permission denied',
    const.NOT_MATCH: 'not match',
    const.INVALID_VERIFY_CODE: 'invalid verify code',
    const.NEED_REFRESH: 'need refresh',
    const.NOT_EXISTS: 'not exists',
    const.UNKNOWN_ERROR: 'unknown_error',
    const.TOO_FREQUENT: 'too frequent',
    const.WAIT_TOMORROW: 'wait tomorrow',
    const.USER_BLOCKED: 'user already blocked',
    const.INVALID_IMAGE_CODE: 'invalid image code',
    const.USER_ERROR: 'user error',
    const.PASSWORD_ERROR: 'password meet the requirement',
    const.PHONE_ERROR: 'phone number meet the requirement',
    const.VALUES_LOSE: 'value is loss',
    const.VALUES_NULL: 'value is null',
    const.SIZE_INVALID_TYPE: 'size invalid type',
    const.TELEPHONE_ERROR: 'telephone error',
    const.QQ_ERROR: 'qq error',
    const.EMAIL_ERROR: 'email error',
    const.UNABLE_REVIEW: 'impossible to review',
    const.UNABLE_EDIT: 'impossible to edit',
    const.UNABLE_OFFLINE: 'impossible to offline',
    const.USER_EMPTY: 'user not exists',
    const.COST_ERROR: 'cost error',
}

# 分类
const.CATEGORY = {
    1: u'社交网络',
    2: u'电子商务',
    3: u'企业信息',
    4: u'金融数据',
    5: u'旅游交通',
    6: u'生活日常',
    7: u'科研开发',
    8: u'其他',
}

# 筛选所有
const.ALL = -1

# 默认密码
const.DEFAULT_PASSWORD = '123456'

# 用户类型
const.CUSTOMER = 0
const.MANAGER = 1
const.SUPERUSER = 2

# 审核状态
const.WAIT_REVIEW = 0       # 待审核
const.OFFLINE = 1        # 已下线
const.SOLVED = 2            # 解决了
const.REVIEW_SUCCESS = 3    # 已发布
const.REVIEW_REJECT = 4     # 未通过
const.NOT_WAIT_REVIEW = 5   # 筛选不是待审核的
const.DEMAND_LIST = 6       # 筛选发布的和已解决的

# 性别
const.MALE = 0
const.FEMAIL = 1
const.UNSET = 2

# 找回密码验证码
const.VERIFY_FOR = 1
# 注册验证码
const.VERIFY_REG = 0

# 审核
const.DOC_DATA = 0
const.DOC_DEMAND = 1

# 锁定激活
const.ACTIVATED = 1
const.BLOCKED = 0

# 分页
const.START = 0
const.COUNT = 10

# 消息类型
const.MESSAGE = 0           # 消息
const.ADVICE = 1            # 投诉建议

# 1/0 收藏/未收藏 添加收藏/取消收藏
const.FAVOR_Y = 1
const.FAVOR_N = 0

# 1/0 消息已读/未读
const.READ_Y = 1
const.READ_N = 0

# 数据来源
const.SOURCE_URL = {
    'http://www.datatang.com': 0,
    'http://api.datatang.com': 1,
    'http://wxlink.jd.com': 2,
    'http://apistore.baidu.com': 3,
    'http://open.weibo.com': 4,
    'https://www.juhe.cn': 5,
    'http://www.dataduoduo.com': 6,
    'http://www.youedata.com': 7,
}

const.FROMOTHER = 1     # 爬取
const.FROMUS = 0    # 独家
const.FROMPUB = 2   # 平台发布

# 排序方式
const.ORDER_INDEX = 0
const.ORDER_LATEST = 1
const.ORDER_HOT = 2
const.ORDER_EXCLUSIVE = 3
const.ORDER_DOWN = 4

# 消息模板
const.MSG_OFFLINE = u'您的{title}已标记为下线'
const.MSG_SOLVED = u'您的{title}已标记为已解决'
const.MSG_REJECT = u'您在{time}发布的{doc}未通过审核，请重新修改提交'
const.MSG_SUCCESS = u'您在{time}发布的{doc}已通过审核'
const.MSG_OFFLINE_CUSTOM = u'{title}已标记为下线'
const.MSG_SOLVED_CUSTOM = u'{title}需求已标记为已解决'

const.MSG_WAIT_REVIEW = u'您有一条数据待审核'
const.DEIVCE_WAIT_REVIEW = u'您有一条定制待审核'

const.DATA_TYPE = {
    0: u'文本',
    1: u'语音',
    2: u'视频',
    3: u'图像',
    4: u'API',
}

const.PRICE = {
    None: u'未知',
    0: u'收费',
    1: u'免费',
    2: u'限量免费',
    3: u'限时免费',
}

const.SUPERMNG = '18780106526'
const.DEFAULT_SOURCE = '数据淘'
const.DEFAULT_CONTACT = '028-61556366/service@datataotao.com'
const.DATATOTAL = 6945867213
