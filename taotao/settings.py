# -*- coding=utf-8 -*-
# Created Time: 2015年09月08日 星期二 17时03分58秒
# File Name: settings.py

import os
try:
    from production import *
except ImportError:

    ###################################
    # tornado的配置
    ###################################

    TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), "client/public")
    STATIC_PATH = os.path.join(os.path.dirname(__file__), "client/public")
    FONT_PATH = os.path.join(os.path.dirname(__file__), "client/image_fonts")

    settings = {
        'debug': True,
        # 'debug': False,
        'cookie_secret': 'qh2g7NtkfC1IPzYQ3S0bBj96m8HUsxMd',
        'template_path': TEMPLATE_PATH,
        'static_path': STATIC_PATH,
        'xsrf_cookies': False,
    }

    ###################################
    # mongodb的配置
    ###################################

    MONGODB_NAME = 'datatao3'
    MONGODB_HOST = '192.168.2.55'

    ###################################
    # celery的配置
    ###################################

    RABBITMQ_USERNAME = 'iceihehe'
    RABBITMQ_PASSWORD = 'iceihehe'
    RABBITMQ_HOST = '192.168.2.55'
    RABBITMQ_NAME = 'datatao'
    SMS_QUEUE = 'sms_queue'
    EMAIL_QUEUE = 'email_queue'

    ###################################
    # pyjwt的配置
    ###################################

    JWT_SECRET = '3cOOU,Zd68p%6iq@Cf|Y'
    JWT_ALGORITHM = 'HS256'
    JWT_EXP = 60*60*24*7
    ACCESS_TOKEN_EXP = 60

    ###################################
    # 验证码的配置
    ###################################

    VERIFYCODE_EXP = 30*60
    # 验证码次数限制
    VERIFY_COUNT = 5
    # 验证码时间限制
    VERIFY_TIME = 60

    ###################################
    # 授权登陆的配置
    ###################################

    HOST_PREFIX = 'http://'
    DATA_DETAIL = '/search/'

    CALLBACK_URL = '/'
    WEIBO_KEY = '840063179'
    WEIBO_SECRET = 'b7e3959924bbf465460591f0660caae2'

    QQ_ID = '101258713'
    QQ_SECRET = '77c6f65fcb8c3a00881acf9f20c6fa49'

    ###################################
    # 容联云通讯的配置
    ###################################

    # 注册模板
    RLYUN_REG_TEMPID = 49033
    # 找回密码模板
    RLYUN_FOR_TEMPID = 50263
    RLYUN_SID = '8a48b5514f2b46d0014f2ffc9aca0596'
    RLYUN_TOKEN = '0cff9cf8883f4c44a908466b92725f58'
    RLYUN_APPID = '8a48b55150b36d920150b80c713210c7'

    ###################################
    # 邮件的配置
    ###################################

    # 注册用
    EMAIL_REG = 0
    # 找回密码用
    EMAIL_FOR = 1
    # KEY
    EMAIL_API = 'key-c97c099861175cacc0b6b791cbd474dc'
    EMAIL_FROM = u'数据淘 <datatao@wolongdata.com>'
    EMAIL_REG_TEXT = u'您的数据淘注册验证码是{0}，请在{1}分钟内输入验证码进行下一步操作。如非本人操作，请忽略此邮件。'
    EMAIL_FOR_TEXT = u'您的数据淘找回密码验证码是{0}，请在{1}分钟内输入验证码进行下一步操作。如非本人操作，请忽略此邮件。'
    EMAIL_REG_SUBJECT = u'欢迎注册数据淘'
    EMAIL_FOR_SUBJECT = u'找回密码-数据淘'
    MAILGUN_SMTP_LOGIN = ("postmaster@sandbox012e3d186f2b4e8ab2536cacb9b3f713."
                          "mailgun.org")
    MAILGUN_SMTP_PASSWORD = "5401b1dd70c1939500bd9386d6dc1179"

    # SMTP or API
    EMAIL_TYPE = 1

    ###################################
    # 七牛的配置
    ###################################

    QINIU_ACCESS_KEY = 'sNb9mHAGhu_vToZl2YAj83rKbj0u682beqLgkxJt'
    QINIU_SECRET_KEY = 'meZEkplL2f-6LnVmSfw21cAGNuHKbclVM1JAJlj4'
    QINIU_BUCKET_NAME = 'datatao'
    QINIU_BUCKET_NAME_PRI = 'datatao-data'
    QINIU_IMAGE_URL = 'http://7xo2al.com1.z0.glb.clouddn.com/'

    ###################################
    # 日志的配置
    ###################################

    APP_LOGFILE = '/var/log/datatao.log'

    ###################################
    # redis的配置
    ###################################

    REDIS_HOST = '192.168.2.55'
    REDIS_TTL = 60

    ###################################
    # elasticsearch的配置
    ###################################
    ES_HOST = '192.168.2.55'
    ES_INDEX = 'datatao3'
    ES_DOCTYPE = 'data'
    ES_ANALYZER = 'chinese'
    # ES_ANALYZER = 'smartcn'
