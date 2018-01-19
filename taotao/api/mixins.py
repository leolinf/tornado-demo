# -*- coding: utf-8 -*-

import elasticsearch
import jieba.analyse

from settings import ES_INDEX, ES_DOCTYPE, ES_HOST, ES_ANALYZER
import const


class DataSearchMixin(object):
    """数据搜索的Mixin"""

    def get_result(self, match, sort, start, count):
        """得到elasticsearch的搜索结果"""

        es = elasticsearch.Elasticsearch(ES_HOST)
        result = es.search(
            ES_INDEX, ES_DOCTYPE, body=match, size=count, from_=start,
            _source_include=[
                'id', 'title', 'category', 'data_type', 'dsize',
                'release_time', 'intro', 'rows', 'comefrom', 'attachmentDown',
                'cost', 'hits', 'price', 'hasAttachment'
            ],
            sort=sort
        )
        return result

    def get_keyword(self, content):
        """得到关键词"""

        keywords = jieba.analyse.extract_tags(
            content, topK=None)
        return keywords

    def get_match(self, **kwargs):
        """生成elasticsearch的query"""

        print(kwargs)

        match = {}
        l = []

        if 'content' in kwargs:
            match = {
                'query':
                    {
                        'multi_match': {
                            'query': kwargs['content'],
                            'fields': [
                                'title^10', 'intro^2', 'detail', 'tags^15'],
                            'analyzer': ES_ANALYZER,
                        }
                    }
                }

        if 'review_status' in kwargs:
            matchy = {'term': {'review_status': int(kwargs['review_status'])}}
            l.append(matchy)

        if 'category' in kwargs:
            matchy = {'term': {'category': int(kwargs['category'])}}
            l.append(matchy)

        if 'dataFormat' in kwargs:
            matchy = {'term': {'data_type': int(kwargs['dataFormat'])}}
            l.append(matchy)

        if 'comeFrom' in kwargs:
            matchy = {'term': {'comefrom': int(kwargs['comefrom'])}}
            l.append(matchy)

        if 'priceType' in kwargs:
            matchy = {'term': {'price': int(kwargs['priceType'])}}
            l.append(matchy)

        if 'hasAttachment' in kwargs:
            matchy = {'term': {'hasAttachment': int(kwargs['hasAttachment'])}}
            l.append(matchy)

        if l:
            match.update({'filter': {'bool': {'must': l}}})

        if not match:
            match = {'query': {'match_all': {}}}

        return match

    def get_sort(self, order):
        """生成elasticsearch的sort"""

        sort = []
        order = int(order)
        print(order)

        if order == const.ORDER_INDEX:
            sort = ['_score', 'comefrom:asc', 'release_time:desc', 'hits:desc']
        elif order == const.ORDER_LATEST:
            sort = ['_score', 'release_time:desc', 'comefrom:asc', 'hits:desc']
        elif order == const.ORDER_HOT:
            sort = ['_score', 'hits:desc', 'release_time:desc']
        elif order == const.ORDER_EXCLUSIVE:
            sort = ['_score', 'comefrom:asc', 'hits:desc', 'release_time:desc']
        elif order == const.ORDER_DOWN:
            sort = [
                '_score', 'attachmentDown:desc', 'hits:desc',
                'release_time:desc']
        else:
            sort = ['_score', 'comefrom:asc', 'release_time:desc', 'hits:desc']

        return sort
