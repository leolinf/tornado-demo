#!/usr/bin/env python
# -*- coding=utf-8 -*-

import front_handler


front_urls = [
    (r'^/testdeal', front_handler.IndexHandler),
    # 首页
    (r'^/{0,1}$', front_handler.IndexHandler),
    (r'^/index$', front_handler.IndexHandler),
    # 登录
    (r'^/signin$', front_handler.IndexHandler),
    # 注册
    (r'^/signup$', front_handler.IndexHandler),
    # 忘记密码
    (r'^/forgetpassword$', front_handler.IndexHandler),
    # 用户协议
    (r'^/useragreement$', front_handler.IndexHandler),
    # 列表
    # (r'^/data/list$', front_handler.IndexHandler),
    (r'^/search/list$', front_handler.IndexHandler),
    # 详情
    #(r'^/data/detail$', front_handler.IndexHandler),
    (r'^/search/detail/(?P<dataId>\w+)/{0,1}$', front_handler.IndexHandler),
    # 需求列表
    (r'^/demand/list$', front_handler.IndexHandler),
    # 需求详情
    (r'^/demand/detail/(?P<dataId>\w+)/{0,1}$', front_handler.IndexHandler),
    # 个人中心
    (r'^/user_center$', front_handler.IndexHandler),
    # 账号设置
    (r'^/user_center/account_set$', front_handler.IndexHandler),
    # 我的下载
    (r'^/user_center/my_download$', front_handler.IndexHandler),
    # 我的收藏
    (r'^/user_center/my_collection$', front_handler.IndexHandler),
    # 我的数据
    (r'^/user_center/my_data$', front_handler.IndexHandler),
    # 编辑数据
    (r'^/user_center/edit_data$', front_handler.IndexHandler),
    # 我的定制
    (r'^/user_center/my_demand$', front_handler.IndexHandler),
    # 消息
    (r'^/user_center/message$', front_handler.IndexHandler),
    # 消息详情
    (r'^/account/message_detail$', front_handler.IndexHandler),
    # 消息反馈
    (r'^/user_center/feedback$', front_handler.IndexHandler),
    # 修改密码
    (r'^/user_center/change_password$', front_handler.IndexHandler),
    # 编辑定制
    (r'^/user_center/edit_demand$', front_handler.IndexHandler),

    # 关于我们
    (r'^/about_us$', front_handler.IndexHandler),
    # 帮助中心
    (r'^/help_center/[123]/{0,1}$', front_handler.IndexHandler),

    # 管理员
    (r'^/admin$', front_handler.IndexHandler),
    # 管理员，我的数据
    (r'^/admin/admin_my_data$', front_handler.IndexHandler),
    # 管理员，数据详情
    (r'^/admin/admin_data_detail$', front_handler.IndexHandler),
    # 管理员，编辑数据
    (r'^/admin/admin_edit_data$', front_handler.IndexHandler),
    # 管理员，消息列表
    (r'^/admin/admin_message$', front_handler.IndexHandler),
    # 管理员，基本设置
    (r'^/admin/base_set$', front_handler.IndexHandler),
    # 管理员，用户管理
    (r'^/admin/user/manage$', front_handler.IndexHandler),
    # 管理员，用户编辑
    (r'^/admin/user/manage_edit$', front_handler.IndexHandler),
    # 管理员，数据管理
    (r'^/admin/data/data_manage$', front_handler.IndexHandler),

    # 组件测试，仅限于开发环境
    (r'^/components/index$', front_handler.IndexHandler),
    (r'^/components/zsselect$', front_handler.IndexHandler),
    (r'^/components/poplayer$', front_handler.IndexHandler),
    (r'^/components/calendar$', front_handler.IndexHandler),


    # 精品数据-总和
    (r'^/quality_data$', front_handler.IndexHandler),

    # 精品数据-天猫
    (r'^/qualityData/tianmao$', front_handler.IndexHandler),
    # 精品数据-企业
    (r'^/qualityData/enterprise$', front_handler.IndexHandler),
    # 精品数据-博客
    (r'^/qualityData/microblog$', front_handler.IndexHandler),
    # 精品数据-本地
    (r'^/qualityData/local$', front_handler.IndexHandler),
    # 平台特色
    (r'^/platformFeature$', front_handler.IndexHandler),

    # su首页
    (r'^/suIndex$', front_handler.IndexHandler),
    # su精品数据
    (r'^/suQualityData$', front_handler.IndexHandler),
]
