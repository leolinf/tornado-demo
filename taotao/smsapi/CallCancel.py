#coding=gbk

#coding=utf-8

#-*- coding: UTF-8 -*-  

from CCPRestSDK import REST
import ConfigParser

#子帐号
subAccountSid= '您的子帐号';

#子帐号Token
subAccountToken= '您的子帐号Token';

#应用Id
appId='您的应用ID';

#请求地址，格式如下，不需要写http://
serverIP='sandboxapp.cloopen.com';

#请求端口 
serverPort='8883';

#REST版本号
softVersion='2013-12-26';

    # 取消回拨
    # @param callSid   必选参数    一个由32个字符组成的电话唯一标识符
    # @param type      可选参数     挂机类型

def CallCancel(callSid,type):
    #初始化REST SDK
    rest = REST(serverIP,serverPort,softVersion)
    rest.setSubAccount(subAccountSid,subAccountToken)
    rest.setAppId(appId)
    
    result = rest.CallCancel(callSid,type)
    for k,v in result.iteritems(): 
        print '%s:%s' % (k, v)
   
   
#CallCancel('callsid','type')