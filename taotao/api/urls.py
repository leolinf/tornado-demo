# -*- coding: utf-8 -*-

from handlers import testHandler, dataHandler, userHandler, universalHandler,\
    operateHandler, imgHandler, ueditorHandler


api_urls = [
    # 测试
    (r'^/v3/api/test/{0,1}$', testHandler.TestHandler),

    ####################################################
    # 数据展示接口
    ####################################################

    # 首页
    (r'^/v3/api/index/{0,1}$', dataHandler.IndexHandler),
    # 数据
    (r'^/v3/api/data/{0,1}$', dataHandler.BaseDataHandler),
    # 独家数据
    (r'^/v3/api/data/exclusive/{0,1}$', dataHandler.ExclusiveDataHandler),
    # 最新数据
    (r'^/v3/api/data/latest/{0,1}$', dataHandler.LatestDataHandler),
    # 热门数据
    (r'^/v3/api/data/hot/{0,1}$', dataHandler.HotDataHandler),
    # 精品数据
    (r'^/v3/api/data/quality/{0,1}$', dataHandler.QualityDataHandler),
    # 下载排行数据
    (r'^/v3/api/data/attachment/{0,1}$', dataHandler.AttachmentDataHandler),
    # 搜索数据
    (r'^/v3/api/data/search/{0,1}$', dataHandler.SearchDataHandler),
    # 分类数据
    (r'^/v3/api/data/category/{0,1}$', dataHandler.CategoryDataHandler),
    # 数据详情
    (r'^/v3/api/data/(?P<dataId>\w+)/{0,1}$',
        dataHandler.DataDetailHandler),
    # 需求列表
    (r'^/v3/api/demand/{0,1}$', dataHandler.DemandListHandler),
    # 需求详情
    (r'^/v3/api/demand/(?P<demandId>\w+)/{0,1}$',
        dataHandler.DemandDetailHandler),

    ####################################################
    # 登陆注册相关接口
    ####################################################

    # 用户登陆
    (r'^/v3/api/token/{0,1}$', userHandler.TokenHandler),
    # 用户注册
    (r'^/v3/api/user/{0,1}$', userHandler.RegisterHandler),
    # 找回密码第一步
    (r'^/v3/api/user/pwd/retrieve1/{0,1}$', userHandler.RetrieveHandler),
    # 找回密码第二步
    (r'^/v3/api/user/pwd/retrieve2/{0,1}$', userHandler.Retrieve2ndHandler),

    ####################################################
    # 验证码相关接口
    ####################################################

    # 获取图片验证码
    (r'^/v3/api/imgCode/{0,1}$', universalHandler.ImageCodeHandler),
    # 验证图片验证码
    (r'^/v3/api/imgCode/check/{0,1}$', universalHandler.CheckImageCodeHandler),
    # 验证验证码
    (r'^/v3/api/verifyCode/{0,1}$', universalHandler.VerifycodeHandler),

    ####################################################
    # 用户登陆后操作接口
    ####################################################

    # 修改密码
    (r'^/v3/api/user/pwd/change/{0,1}$', operateHandler.ResetPwdHandler),
    # 用户信息
    (r'^/v3/api/user/info/{0,1}$', operateHandler.InfoHandler),
    # 收藏
    (r'^/v3/api/user/favorite/{0,1}$', operateHandler.FavoriteHandler),
    # 获取我的下载
    (
        r'^/v3/api/user/attachment/{0,1}$',
        operateHandler.AttachmentHistoryHandler),
    # 发布数据和数据列表
    (r'^/v3/api/user/data/{0,1}$', operateHandler.UserDataHandler),
    # 发布意见反馈和消息列表
    (r'^/v3/api/user/message/{0,1}$', operateHandler.MessageHandler),
    # 下线数据
    (r'^/v3/api/user/data/offline/{0,1}$', operateHandler.DataOfflineHandler),
    # 发布定制和定制列表
    (r'^/v3/api/user/demand/{0,1}$', operateHandler.UserDemandHandler),
    # 下线定制
    (
        r'^/v3/api/user/demand/offline/{0,1}$',
        operateHandler.DemandOfflineHandler),
    # 消息标为已读
    (r'^/v3/api/user/message/read/{0,1}$',
        operateHandler.MessageReadHandler),
    # 删除消息
    (r'^/v3/api/user/message/del/{0,1}$', operateHandler.MessageDelHandler),

    ####################################################
    # 七牛相关
    ####################################################
    (r'^/v3/api/getAttachmentURI/{0,1}$', imgHandler.PrivateUrlHandler),
    (r'^/v3/api/uptoken/{0,1}$', imgHandler.UploadTokenHandler),

    ####################################################
    # 七牛相关
    ####################################################
    (r'^/v3/api/ueditor/{0,1}$', ueditorHandler.UeditorHandler),
]
