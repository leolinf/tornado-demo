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

    # ˫��غ�
    # @param fromPhone  ��ѡ����   ���е绰����
    # @param to ��ѡ����    ���е绰����
    # @param customerSerNum ��ѡ����    ���в���ʾ�Ŀͷ�����  
    # @param fromSerNum ��ѡ����    ���в���ʾ�ĺ���
    # @param promptTone ��ѡ����    �������Զ���ز���ʾ��  
    # @param alwaysPlay ��ѡ���� �Ƿ�һֱ������ʾ��
    # @param terminalDtmf ��ѡ���� ������ֹ������ʾ���İ���
    # @param userData ��ѡ����    ������˽������  
    # @param maxCallTime ��ѡ����    ���ͨ��ʱ��
    # @param hangupCdrUrl ��ѡ����    ʵʱ����֪ͨ��ַ    
    # @param needBothCdr ��ѡ���� �Ƿ�������з��ͻ���
    # @param needRecord ��ѡ���� �Ƿ�¼��
    # @param countDownTime ��ѡ���� ���õ���ʱʱ��
    # @param countDownPrompt ��ѡ���� ���ﵹ��ʱʱ�䲥�ŵ���ʾ��

def callBack(fromPhone,to,customerSerNum,fromSerNum,promptTone,alwaysPlay,terminalDtmf,userData,maxCallTime,hangupCdrUrl,needBothCdr,needRecord,countDownTime,countDownPrompt):

    
    #��ʼ��REST SDK
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
   
#callBack('���к���','���к���','���в���ʾ�Ŀͷ�����','���в���ʾ�ĺ�','�Զ���ز���ʾ��','�Ƿ�һֱ������ʾ��','��ֹ���Ŷ������ʾ���İ���','������˽������','���ͨ��ʱ��','ʵʱ����֪ͨ��ַ','�Ƿ�������з��ͻ���','�Ƿ�¼��','���õ���ʱʱ��','�������Զ��嵹��ʱ��ʾ��')