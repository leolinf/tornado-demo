#!/usr/bin/env python
# -*- coding=utf-8 -*-

from front.urls import front_urls
from api.urls import api_urls

urls = []
urls.extend(front_urls)
urls.extend(api_urls)
