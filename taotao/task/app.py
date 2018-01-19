# -*- coding: utf-8 -*-

import sys
sys.path.append('../')

from celery import Celery
from settings import RABBITMQ_HOST, RABBITMQ_PASSWORD, RABBITMQ_USERNAME,\
    RABBITMQ_NAME


app = Celery(
    RABBITMQ_NAME,
    include=['task.tasks'],
    broker='amqp://{0}:{1}@{2}/{3}'.format(
        RABBITMQ_USERNAME, RABBITMQ_PASSWORD, RABBITMQ_HOST, RABBITMQ_NAME,)
)


if __name__ == '__main__':
    app.start()
