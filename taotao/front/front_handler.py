#!/usr/bin/env python
# -*- coding=utf-8 -*-

"""
这个handler是前端控制的路由
"""
import tornado.httpclient
import tornado.gen

from base.handler import BaseHandler
import json
import const
import urlparse
import urllib

class IndexHandler(BaseHandler):
    """首页"""

    @tornado.web.removeslash
    @tornado.gen.coroutine
    def get(self, *args, **kwargs):
        
        user_agent = self.request.headers.get('User-Agent')
        referer = self.request.headers.get('Referer')
        spiders = [
            'Baiduspider',
            'Googlebot',
            'Sogou web spider',
            'Yahoo! Slurp',
            'HaosouSpider',
            'bingbot',
            'YisouSpider',
            '360Spider',
        ]
        '''
        path = self.request.path
        if path.startswith('/hot_demand/detail'):
            self.redirect('/hot_demand')
            return
        '''

        # SEO
        if  any(i in user_agent for i in spiders):
        
            path = self.request.path
            host = self.request.headers['Host']
            query_string = self.request.query

            c = 'http://' + host + '/'
            pre = 'http://'+host+'/serverpage/'
            client = tornado.httpclient.AsyncHTTPClient()

            if path == '/':

                response = yield client.fetch(c+'v3/api/index')
                res = json.loads(response.body).get('data')
                print res
                self.render('serverpage/index.html', res=res)

            elif path.startswith('/search/list'):
                page = int(self.get_argument('page', 1))
                count = int(self.get_argument('count', const.COUNT))
                start = (page - 1) * count
                query = dict(urlparse.parse_qsl(query_string))
                if 'page' in query:
                    query.pop('page')
                query.update({'start': start})

                print "fefeefefwopcao nifefgergr::::::____", urllib.urlencode(query)
                response = yield client.fetch(c + 'v3/api/data/search?' + urllib.urlencode(query))
                res = json.loads(response.body).get('data')
                param = {"start": 0, "count": 10}
                response = yield client.fetch(c + 'v3/api/data/attachment?' + urllib.urlencode(param))
                hot1 = json.loads(response.body).get('data')

                response = yield client.fetch(c + 'v3/api/data/hot?' + urllib.urlencode(param))
                hot2 = json.loads(response.body).get('data')

                response = yield client.fetch(c + 'v3/api/data/category')
                cate = json.loads(response.body).get('data')

                self.render('serverpage/data_search.html', datamain=res, hot1=hot1, hot2=hot2, cate=cate, c=c,
                            page=page, count=count)

            elif path.startswith('/search/detail/'):
                # v3/api/data/56fe33d4365d0f2a1c7d3679
                query = dict(urlparse.parse_qsl(query_string))
                dataId = query.get('dataId')
                print 'data:  fefefefefefefefef:   :', self.request.body, kwargs['dataId']
                response = yield client.fetch(c + 'v3/api/data/'+kwargs['dataId'])
                res = json.loads(response.body).get('data')
                category = const.CATEGORY[int(res.get('category'))]
                dataType = const.DATA_TYPE[int(res.get('dataFormat'))]
                print category, dataType
                self.render('serverpage/data_search_detail.html', category=category, dataType=dataType, res=res)
        print "fefefefefefefefe"
        self.render('modules/core/frame.tpl.html')

