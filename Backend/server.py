from flask import Flask,jsonify,request
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from time import sleep
from flask_cors import CORS
app=Flask(__name__)
CORS(app)
@app.route('/',methods=['POST'])
def search_product():
    query=request.get_json()
    q=query.get('data')
    print(q)
    options = Options()
    options.add_argument('--headless')
    options.page_load_strategy = 'normal'
    driver = webdriver.Chrome(options=options)
            # driver.maximize_window()
    driver.get(f"http://www.google.com/search?q={q}")
    try:
         WebDriverWait(browser, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".mnr-c")))
    except TimeoutException:
            print("Selector not found")
            return jsonify({"error": "Selector not found on the page"})
    name=driver.find_element(By.CSS_SELECTOR,'span.pymv4e').text
    price=driver.find_element(By.CSS_SELECTOR,'span.e10twf').text
    img_div=driver.find_element(By.CSS_SELECTOR,'div.Gor6zc')
    img=img_div.find_element(By.TAG_NAME,'img')
    img_src=img.get_attribute('src')
    response={
                'name':name,
                'price':price,
                'img':img_src
            }
    return jsonify(response),200
if __name__ == '__main__':
    app.run()