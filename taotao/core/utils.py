# -*- coding: utf-8 -*-

from email.mime.text import MIMEText
import smtplib
import StringIO
import random
import requests
import json

from PIL import Image, ImageDraw, ImageFont
import dateutil.parser
import qiniu
import jwt

from settings import FONT_PATH, EMAIL_REG, EMAIL_FOR, EMAIL_FOR_TEXT,\
    EMAIL_REG_TEXT, EMAIL_API, EMAIL_FROM, EMAIL_REG_SUBJECT,\
    EMAIL_FOR_SUBJECT, VERIFYCODE_EXP, MAILGUN_SMTP_LOGIN,\
    MAILGUN_SMTP_PASSWORD, JWT_SECRET, JWT_ALGORITHM, QINIU_IMAGE_URL,\
    QINIU_BUCKET_NAME, QINIU_ACCESS_KEY, QINIU_SECRET_KEY, SMTP_HOST,\
    SMTP_PORT


def formates(datatup):
    """es返回的问题"""

    data, i, score = datatup

    t = dateutil.parser.parse(data.pop('release_time')).strftime('%s')
    data['releaseTime'] = t

    data['dataSize'] = data.pop('dsize')
    data['id'] = i
    data['comeFrom'] = data.pop('comefrom')
    data['dataFormat'] = data.pop('data_type')
    data['priceType'] = data.pop('price')
    data['_score'] = score

    return data


def encrypt_token(payload, secret=JWT_SECRET, algorithm=JWT_ALGORITHM):
    """加密"""

    return jwt.encode(payload, secret, algorithm=algorithm)


def decrypt_token(
        token, secret=JWT_SECRET, algorithms=JWT_ALGORITHM, options=None):
    """解密"""
    if not options:
        options = {
            'verify_signature': True,
            # 'verify_exp': False,
            'verify_exp': True,
            'verify_nbf': False,
            'verify_iat': False,
            'verify_aud': False,
            'require_exp': False,
            'require_iat': False,
            'require_nbf': False
        }

    try:
        res = jwt.decode(
            token, secret, algorithms=algorithms, options=options)
    except jwt.ExpiredSignatureError:
        print 'ExpiredSignatureError'
        return {}
    except jwt.DecodeError:
        print 'DecodeError'
        return {}
    except jwt.InvalidTokenError:
        print 'InvalidTokenError'
        return {}
    except:
        print 'Error'
        return {}
    else:
        return res


def create_validate_code():
    CHAR = ('acdefghijkmnpqrstuvwxyABCDEFGHJKLMNPQRSTUVWXY345789')
    LEN = len(CHAR) - 1
    PADDING = 30
    X_SPACE = 6     # 两个字符之间最少相隔多少个像素
    TRY_COUNT = 30  # 随机字符的位置尝试最多多少次,避免死循环
    WIDTH = 120
    HEIGHT = 30
    FONT_TYPE = FONT_PATH + '/FreeSerif.ttf'
    FONT_SIZE = 18
    # FONT = ImageFont.load('FreeSerif.ttf')
    FONT = ImageFont.truetype(FONT_TYPE, FONT_SIZE)
    im = Image.new('1', (WIDTH, HEIGHT), 'white')
    draw = ImageDraw.Draw(im)
    w, h = im.size

    # S = [(x, y, 'c')]
    S = []
    x_list = []
    y_list = []
    n = 0
    while True:
        n += 1
        if n > TRY_COUNT:
            break
        x = random.randint(0, w - PADDING)
        flag = True
        for i in x_list:
            if abs(x - i) < X_SPACE:
                flag = False
                continue
            if not flag:
                break
        if not flag:
            continue

        y = random.randint(0, h - PADDING)
        x_list.append(x)
        y_list.append(y)
        S.append((x, y, CHAR[random.randint(0, LEN)]))
        if len(S) == 4:
            break

    for x, y, c in S:
        draw.text((x, y), c, font=FONT)

    # 加3根干扰线
    for i in range(3):
        x1 = random.randint(0, (w - PADDING) / 2)
        y1 = random.randint(0, (h - PADDING / 2))
        x2 = random.randint(0, w)
        y2 = random.randint((h - PADDING / 2), h)
        draw.line(((x1, y1), (x2, y2)), fill=0, width=1)

    S.sort(lambda x, y: 1 if x[0] > y[0] else -1)
    char = [x[2] for x in S]

    s = StringIO.StringIO()
    im.save(s, 'jpeg')
    # im.show()
    return s.getvalue(), ''.join(char).lower()


def send_email_via_api(email, verifycode, v_type):
    """api发送邮件验证码"""

    data = {
        'from': EMAIL_FROM,
        'to': email,
    }
    # 注册用
    if v_type == EMAIL_REG:
        data.update({
            'subject': EMAIL_REG_SUBJECT,
            'text': EMAIL_REG_TEXT.format(verifycode, VERIFYCODE_EXP / 60),
        })

    elif v_type == EMAIL_FOR:
        data.update({
            'subject': EMAIL_FOR_SUBJECT,
            'text': EMAIL_FOR_TEXT.format(verifycode, VERIFYCODE_EXP / 60),
        })

    auth = requests.auth.HTTPBasicAuth('api', EMAIL_API)

    url = ('https://api.mailgun.net/v3/'
           'sandbox012e3d186f2b4e8ab2536cacb9b3f713.mailgun.org/messages')

    print('send <{0}> to email {1}'.format(verifycode, email))
    requests.post(url, auth=auth, data=data)


def send_message_via_smtp(from_, to, mime_string):
    ''' sends a mime message to mailgun SMTP gateway '''
    smtp = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
    smtp.login(MAILGUN_SMTP_LOGIN, MAILGUN_SMTP_PASSWORD)
    smtp.sendmail(from_, to, mime_string)
    smtp.quit()


def send_email_via_smtp(to, verifycode, v_type, tag=None, variables={},
                        track=True):
    ''' compose and sends a text-only message through mailgun '''

    if v_type == EMAIL_REG:
        subject = EMAIL_REG_SUBJECT
        text = EMAIL_REG_TEXT.format(verifycode, VERIFYCODE_EXP / 60)

    elif v_type == EMAIL_FOR:
        subject = EMAIL_FOR_SUBJECT
        text = EMAIL_FOR_TEXT.format(verifycode, VERIFYCODE_EXP / 60)

    msg = MIMEText(text, _charset='utf-8')

    msg['Subject'] = subject
    msg['From'] = EMAIL_FROM
    msg['To'] = to
    if tag:
        # you can attach tags to your messages
        msg['X-Mailgun-Tag'] = tag
    if track:
        # you can auto transform links to track clicks
        msg['X-Mailgun-Track'] = "yes"
        if variables:
            # you can embed data in the email, will be passed to your webhook
            msg['X-Mailgun-Variables'] = json.dumps(variables)
    print('send <{0}> to email {1}'.format(verifycode, to))

    send_message_via_smtp(EMAIL_FROM, to, msg.as_string())


def qiniu_upload(filename, media_file, file_type='image'):
    """七牛上传"""
    q = qiniu.Auth(QINIU_ACCESS_KEY, QINIU_SECRET_KEY)
    token = q.upload_token(QINIU_BUCKET_NAME)

    """
    mime = {
        'image': 'image/jpeg',
        'audio': 'audio/mp3',
    }
    """
    # mime_type = mime.get(file_type, 'image/jpeg')
    ret, info = qiniu.put_data(
        token, filename, media_file, mime_type=file_type)
    print('qiniu info: ', info)

    url = QINIU_IMAGE_URL + filename

    return url

def formattime(timestamp, format):
    """给模板用的解析时间"""
    import datetime
    t = datetime.datetime.fromtimestamp(int(timestamp))
    return t.strftime(format)


def formatsize(size, rows):
    """给模板用的解析大小"""

    if 0 < size < 1000:
        return '{0}\t{1}'.format(size, 'B')
    elif 1000 <= size < 1000000:
        return '{0}\t{1}'.format(size/1000, 'KB')
    elif 1000000 <= size < 1000000000:
        return '{0}\t{1}'.format(size/1000000, 'MB')
    elif 1000000000 <= size < 1000000000000:
        return '{0}\t{1}'.format(size/1000000000, 'GB')
    elif 1000000000000 <= size < 1000000000000000:
        return '{0}\t{1}'.format(size/1000000000, 'TB')
    elif size == 0 and rows == 0:
        return u'暂无'
    else:
        return u'{0}\t{1}'.format(rows, u'条')


def formatcategory(category):
    """给模板用的解析分类"""
    import const
    return const.CATEGORY[category]


def formatdatatype(datatype):
    """给模板用的解析数据类型"""
    import const
    return const.DATA_TYPE[datatype]


def formatpage(query, page):
    """给模板用的生成翻页"""

    query.update({'page': page})
    import urllib
    return urllib.urlencode(query)


def formatprice(price):
    """给模板用的解析标价"""
    import const
    return const.PRICE[price]


def formates(datatup):
    """es返回的问题"""

    data, i, score = datatup

    t = dateutil.parser.parse(data.pop('release_time')).strftime('%s')
    data['releaseTime'] = t

    data['dataSize'] = data.pop('dsize')
    data['id'] = i
    data['comeFrom'] = data.pop('comefrom')
    data['dataFormat'] = data.pop('data_type')
    data['priceType'] = data.pop('price')
    data['_score'] = score

    return data
