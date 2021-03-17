import os

from flask import Flask
from flask import jsonify
from flask_cors import CORS

from bs4 import BeautifulSoup
import requests
from selenium import webdriver
import time

import json

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )
    app.config['JSON_AS_ASCII'] = False     ## chinese json file support

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    

    # a simple page that says hello
    @app.route('/hello')
    def hello():
        return 'Hello, World!'


    @app.route('/gossip')
    def gossip():
        return jsonify(getGossipData())

    @app.route('/baseball')
    def baseball():
        init()
        return "123"
    return app

def getGossipData():
    cookie = {'over18': "1"}

    r = requests.get(
        "https://www.ptt.cc/poll/Gossiping/M.1615973512.A.98F.html?cacheKey=2431-563221141&offset=522&offset-sig=425ae8f2031a3275a5bc32c4cd8978af07f66352&size=3684&size-sig=8a1ba13cf780b3da3d207ceea9a846559f664a1b",
        cookies=cookie
        )

    jsonResponse = r.json()
    contentHtml = jsonResponse["contentHtml"]
    contentHtml = "<!DOCTYPE html><html><body>" + contentHtml + "</body></html>"

    soup = BeautifulSoup(contentHtml, 'html.parser')

    pushes = soup.find_all('span', {"class": "push-content"})
    pushTextList = []
    for push in pushes:
        pushTextList.append(push.text[1:])

    return pushTextList

def getPollUrl():
    url = "https://www.ptt.cc/bbs/Baseball/M.1615976013.A.E28.html"
    pttRes = requests.get(url)

    soup = BeautifulSoup(pttRes.content, 'html.parser')
    pollingBtn = soup.find("div", {"id": "article-polling"})
    dataPollUrl = "https://www.ptt.cc" + pollingBtn['data-pollurl']
    dataLongPollUrl = "https://www.ptt.cc" + pollingBtn['data-longpollurl']
    return dataPollUrl, dataLongPollUrl 

def init():

    dataPollUrl, dataLongPollUrl = getPollUrl()

    # request long poll
    longPollRes = requests.get(dataLongPollUrl).json()
    print(longPollRes)
    
    # set poll url
    url = dataPollUrl + '&size=' + str(longPollRes["size"]) + '&size-sig=' + str(longPollRes["sig"])

    # request poll
    pollRes = requests.get(url).json()

    # set new poll url
    dataPollUrl = pollRes["pollUrl"]

