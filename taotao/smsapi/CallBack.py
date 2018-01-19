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

    # 双向回呼
    # @param fromPhone  必选参数   主叫电话号码
    # @param to 必选参数    被叫电话号码
    # @param customerSerNum 可选参数    被叫侧显示的客服号码  
    # @param fromSerNum 可选参数    主叫侧显示的号码
    # @param promptTone 可选参数    第三方自定义回拨提示音  
    # @param alwaysPlay 可选参数 是否一直播放提示音
    # @param terminalDtmf 可选参数 用于终止播放提示音的按键
    # @param userData 可选参数    第三方私有数据  
    # @param maxCallTime 可选参数    最大通话时长
    # @param hangupCdrUrl 可选参数    实时话单通知地址    
    # @param needBothCdr 可选参数 是否给主被叫发送话单
    # @param needRecord 可选参数 是否录音
    # @param countDownTime 可选参数 设置倒计时时间
    # @param countDownPrompt 可选参数 到达倒计时时间播放的提示音

def callBack(fromPhone,to,customerSerNum,fromSerNum,promptTone,alwaysPlay,terminalDtmf,userData,maxCallTime,hangupCdrUrl,needBothCdr,needRecord,countDownTime,countDownPrompt):

    
    #初始化REST SDK
    rest = REST(serverIP,serverPort,softVersion)
    rest.setSubAccount(subAccountSid,subAccountToken)
    rest.setAppId(appId)
    
    result = rest.callBack(fromPhone,to,customerSerNum,fromSerNum,promptTone,alwaysPlay,terminalDtmf,userData,maxCallTime,hangupCdrUrl,needBothCdr,needRecord,countDownTime,countDownPrompt)
    for k,v in result.iteritems(): 
        
        if k=='CallBack' :
                for k,s in v.iteritems(): 
                    print '%s:%s' % (k, s)
        else:
            print '%s:%s' % (k, v)
   
#callBack('主叫号码','被叫号码','被叫侧显示的客服号码','主叫侧显示的号','自定义回拨提示音','是否一直播放提示音','终止播放定义的提示音的按键','第三方私有数据','最大通话时长','实时话单通知地址','是否给主被叫发送话单','是否录音','设置倒计时时间','第三方自定义倒计时提示音')