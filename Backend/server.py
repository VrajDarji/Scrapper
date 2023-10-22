from flask import Flask,jsonify,request
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
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
    if q:
        try:
            options = Options()
            options.add_argument('--headless')
            options.page_load_strategy = 'normal'
            driver = webdriver.Chrome(options=options)
            # driver.maximize_window()
            driver.get("http://www.google.com/search?q=iphone mobile")
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
        except Exception as e:
            return jsonify({'message': f'Error: {str(e)}'}), 500    
    else:
         return jsonify({'message': 'Please provide a search query'}), 400
if __name__ == '__main__':
    app.run()