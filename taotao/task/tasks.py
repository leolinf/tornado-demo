# -*- coding: utf-8 -*-

from app import app
from smsapi.SendTemplateSMS import sendTemplateSMS
from settings import VERIFYCODE_EXP, EMAIL_TYPE
from core.utils import send_email_via_api, send_email_via_smtp


@app.task
def send_sms(mobile, verifycode, tempId):
    """发送短信验证码"""
    sendTemplateSMS(mobile, [verifycode, VERIFYCODE_EXP / 60], tempId)
    print('send <{0}> to mobile {1}'.format(verifycode, mobile))


@app.task
def send_email(email, verifycode, v_type):
    """发送邮件验证码"""

    if EMAIL_TYPE == 1:
        send_email_via_smtp(email, verifycode, v_type)
    else:
        send_email_via_api(email, verifycode, v_type)
