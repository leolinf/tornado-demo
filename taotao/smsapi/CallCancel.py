#coding=gbk

#coding=utf-8

#-*- coding: UTF-8 -*-  

from CCPRestSDK import REST
import ConfigParser

#���ʺ�
subAccountSid= '�������ʺ�';

#���ʺ�Token
subAccountToken= '�������ʺ�Token';

#Ӧ��Id
appId='����Ӧ��ID';

#�����ַ����ʽ���£�����Ҫдhttp://
serverIP='sandboxapp.cloopen.com';

#����˿� 
serverPort='8883';

#REST�汾��
softVersion='2013-12-26';

    # ȡ���ز�
    # @param callSid   ��ѡ����    һ����32���ַ���ɵĵ绰Ψһ��ʶ��
    # @param type      ��ѡ����     �һ�����

def CallCancel(callSid,type):
    #��ʼ��REST SDK
    rest = REST(serverIP,serverPort,softVersion)
    rest.setSubAccount(subAccountSid,subAccountToken)
    rest.setAppId(appId)
    
    result = rest.CallCancel(callSid,type)
    for k,v in result.iteritems(): 
        print '%s:%s' % (k, v)
   
   
#CallCancel('callsid','type')