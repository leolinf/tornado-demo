#coding=gbk

#coding=utf-8

#-*- coding: UTF-8 -*-  

from CCPRestSDK import REST
import ConfigParser

#���ʺ�
accountSid= '�������ʺ�';

#���ʺ�Token
accountToken= '�������ʺ�Token';

#Ӧ��Id
appId='����Ӧ��ID';

#�����ַ����ʽ���£�����Ҫдhttp://
serverIP='sandboxapp.cloopen.com';

#����˿� 
serverPort='8883';

#REST�汾��
softVersion='2013-12-26';

    # ������֤��
    # @param verifyCode  ��ѡ����   ��֤�����ݣ�Ϊ���ֺ�Ӣ����ĸ�������ִ�Сд������4-8λ
    # @param playTimes  ��ѡ����   ���Ŵ�����1��3��
    # @param to ��ѡ����    ���պ���
    # @param displayNum ��ѡ����    ��ʾ�����к���
    # @param respUrl ��ѡ����    ������֤��״̬֪ͨ�ص���ַ����ͨѶƽ̨�����Url��ַ���ͺ��н��֪ͨ
    # @param lang ��ѡ����    ��������
    # @param userData ��ѡ����    ������˽������

def voiceVerify(verifyCode,playTimes,to,displayNum,respUrl,lang,userData):
    #��ʼ��REST SDK
    rest = REST(serverIP,serverPort,softVersion)
    rest.setAccount(accountSid,accountToken)
    rest.setAppId(appId)
    
    result = rest.voiceVerify(verifyCode,playTimes,to,displayNum,respUrl,lang,userData)
    for k,v in result.iteritems(): 
        
        if k=='VoiceVerify' :
                for k,s in v.iteritems(): 
                    print '%s:%s' % (k, s)
        else:
            print '%s:%s' % (k, v)
   
   
#voiceVerify('��֤������','���Ŵ���','���պ���','��ʾ�����к���','������֤��״̬֪ͨ�ص���ַ','��������','������˽������')