# -*- coding=utf-8 -*-

from django.http import HttpResponse
from django.views.generic import View


class YuntongxunInterfaceView(View):
    '''
    云通讯交互
    '''
    def post(self, request, *args, **kwargs):
        print(request.POST)
        print(request.body)
        return HttpResponse({})

    def get(self, request, *args, **kwargs):
        print(request.GET)
        print(request.body)
        return HttpResponse({})
