import os

from flask import Flask
from flask import jsonify
from flask_cors import CORS

from bs4 import BeautifulSoup
import requests
from selenium import webdriver
import time

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

    @app.route('/push_comment')
    def push_comment():
        return jsonify(get_push_tags())

    return app

def get_push_tags():
    time.sleep(10)
    ## selenium
    driver = webdriver.Chrome()
    driver.get("https://www.ptt.cc/bbs/Baseball/M.1615711239.A.8E2.html")

    scrollBottom(driver)

    element = driver.find_element_by_id("article-polling")
    element.click()

    ## soup
    time.sleep(2)
    soup = BeautifulSoup(driver.page_source, 'html.parser')

    div_push_tags = soup.find_all('div', {"class": "push"})
    
    push_comments = []
    print(len(div_push_tags))

    push_content = div_push_tags[len(div_push_tags) - 1].find("span", {"class": "push-content"}).text
    push_comments.append(push_content)
    push_content = div_push_tags[len(div_push_tags) - 2].find("span", {"class": "push-content"}).text
    push_comments.append(push_content)
    driver.close()
    return push_comments

def scrollBottom(driver):
    ## Scroll
    last_height = driver.execute_script("return document.body.scrollHeight")
    while True:

        # Scroll down to the bottom.
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

        # Wait to load the page.
        time.sleep(1)

        # Calculate new scroll height and compare with last scroll height.
        new_height = driver.execute_script("return document.body.scrollHeight")

        if new_height == last_height:
            break

        last_height = new_height
    ## end Scroll