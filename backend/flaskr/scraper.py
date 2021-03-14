from bs4 import BeautifulSoup
import requests
from selenium import webdriver
import time

# r = requests.get("https://www.ptt.cc/bbs/Baseball/M.1615711239.A.8E2.html")

# html = r.content

# soup = BeautifulSoup(html, 'html.parser')

# # Write the parsed html file to parsed.html
# # with open('parsed.html', 'w+') as file:
# #     file.write(soup.prettify())

# div_push_tags = soup.find_all('div', {"class": "push"})
# # print(len(div_push_tags))
# # print()
# # print(div_push_tags[0])
# # print()
# # print(div_push_tags[len(div_push_tags) - 1])
# # print()

# with open('push_contents', 'w+') as file:
#     for push_tag in div_push_tags:
#         push_content = push_tag.find("span", {"class": "push-content"}).text
#         file.write(push_content)
#         file.wirte("\n")
#         # print(push_content)
# print(div_push_tags[0].find_all('span', {"class": "push-content"})[0].text)

# def get_push_tags():
#     r = requests.get("https://www.ptt.cc/bbs/Baseball/M.1615711239.A.8E2.html")

#     html = r.content

#     soup = BeautifulSoup(html, 'html.parser')

#     div_push_tags = soup.find_all('div', {"class": "push"})
#     print(div_push_tags[0].find_all('span', {"class": "push-content"})[0].text)
#     # return div_push_tags[0].find_all('span', {"class": "push-content"})[0].text

# get_push_tags()

def sel():
    driver = webdriver.Chrome()
    driver.get("https://www.ptt.cc/bbs/Baseball/M.1615711239.A.8E2.html")

    ## Scroll
    last_height = driver.execute_script("return document.body.scrollHeight")

    while True:

        # Scroll down to the bottom.
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

        # Wait to load the page.
        time.sleep(2)

        # Calculate new scroll height and compare with last scroll height.
        new_height = driver.execute_script("return document.body.scrollHeight")

        if new_height == last_height:

            break

        last_height = new_height
    ## end Scroll

    element = driver.find_element_by_id("article-polling")
    element.click()

    ## beautiful soup
    soup = BeautifulSoup(driver.page_source, 'html.parser')

    div_push_tags = soup.find_all('div', {"class": "push"})
    print(div_push_tags[len(div_push_tags) - 1].find_all('span', {"class": "push-content"})[0].text)
    # return div_push_tags[0].find_all('span', {"class": "push-content"})[0].text


sel()