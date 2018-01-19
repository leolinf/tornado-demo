# coding=gbk

# coding=utf-8

# -*- coding: UTF-8 -*-

from CCPRestSDK import REST
from settings import RLYUN_SID, RLYUN_TOKEN, RLYUN_APPID, RLYUN_REG_TEMPID, RLYUN_FOR_TEMPID
# import ConfigParser

accountSid = RLYUN_SID

accountToken = RLYUN_TOKEN

appId = RLYUN_APPID

serverIP = 'app.cloopen.com'
# serverIP = 'https://sandboxapp.cloopen.com'

serverPort = '8883'

softVersion = '2013-12-26'


def sendTemplateSMS(to, datas, tempId):

    rest = REST(serverIP, serverPort, softVersion)
    rest.setAccount(accountSid, accountToken)
    rest.setAppId(appId)

    result = rest.sendTemplateSMS(to, datas, tempId)
    for k, v in result.iteritems():
        if k == 'templateSMS':
            for k, s in v.iteritems():
                print '%s:%s' % (k, s)
        else:
            print '%s:%s' % (k, v)

if __name__ == '__main__':
    sendTemplateSMS('13808099842', ['asdfasdfsadfasdf'], '40004')
