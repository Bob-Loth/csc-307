from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS
from model_mongodb import *
import jwt
import datetime

from hash import *
from Verification import verify_password

app = Flask(__name__)
CORS(app)


@app.route('/')
def home():
    return "Home"


@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        login_attempt = request.get_json()
        username = login_attempt.get('name')
        password = login_attempt.get('pwd')
        login = Login(login_attempt)

        db_hash = login.find_name_ret_hash(username)
        error_dict = verify_password(username, password)
        user = login.find_name_ret_hash(username)

        encoded = jwt.encode({
            'jwtToken': {
                'username': username,
                'pwd_hash': user
            }
        }, 'csc307_key_jwt', algorithm='HS256')

        if db_hash is False:
            resp = jsonify(success=False, errors=error_dict, hash='false')
            return resp, 401

        match = verify(password, db_hash)

        if match:
            resp = jsonify(success=True, errors=error_dict, jwtToken=encoded)
            return resp, 200
        else:
            resp = jsonify(success=False, errors=error_dict, verify='false')
            return resp, 401


@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        name = request.get_json().get('name')
        pwd = request.get_json().get('pwd')

        errors = verify_password(name, pwd)

        new_user = Register(request.get_json())

        if len(errors['username']) == 0 and len(errors['username']) == 0:
            if(new_user.register_user(name, encrypt(pwd))):
                resp = jsonify(success=True, errors=errors)
                return resp, 201
            else:
                errors['username'].append('User already registered')
                resp = jsonify(success=False, errors=errors)
                return resp, 409
        else:
            resp = jsonify(success=False, errors=errors)
            return resp, 409


@app.route('/dashboard', methods=['GET'])
def dashboard():
    return "dashboard"


@app.route('/dashboard/expiry', methods=['GET'])
def dashboard_expiry():
    if request.method == 'GET':
        products = Search()
        return products.get_sorted_limit("expiration_date", 5)


@app.route('/dashboard/lowstock', methods=['GET'])
def dashboard_lowstock():
    if request.method == 'GET':
        products = Search()
        return products.get_sorted_limit("stock", 5)


@app.route('/search', methods=['GET', 'PATCH'])
def search():
    if request.method == 'GET':

        #  if there is json in the request run this
        search_request = request.args

        if search_request:
            productdb = Search()

            #  set Params
            keyword = search_request.get('keyword')
            filter_category = search_request.get('filterCategory')
            greaterThan = False
            stockAbove = False

            # remove comparison and cast to int
            price_range = search_request.get('priceRange')
            if price_range != 'none':
                if price_range[0] == '>':
                    greaterThan = True
                price_range = int(price_range[1:])
            else:
                price_range = 0

            expiry = search_request.get('expiry')

            # remove comparison and cast to int
            stock_range = search_request.get('stockRange')
            if stock_range != 'none':
                if stock_range[0] == '>':
                    stockAbove = True
                stock_range = int(stock_range[1:])
            else:
                stock_range = 0

            expiry = search_request.get('expiry')
            #  ------------------------------------

            products = productdb.find_filter(keyword, filter_category,
                                             price_range, expiry, greaterThan,
                                             stockAbove, stock_range)
            return jsonify(products=products)

        productdb = Product()
        products = productdb.list_all()

        return jsonify(products=products)

    if request.method == 'PATCH':
        id = request.args.get("_id")
        productdb = Product()

        updates = request.get_json()

        r_date = str(request.get_json().get('expiration_date'))
        # if it exists in update object, format the date for suitable storage
        # in mongoDB.

        if (request.get_json().get('expiration_date')):
            temp_date = datetime.date(int(r_date[0:4]),
                                      int(r_date[5:7]),
                                      int(r_date[8:10]))
            updates['expiration_date'] = \
                datetime.datetime.combine(temp_date, datetime.time.min)
        product = productdb.list_update(id, updates)
        if product:
            return product, 205
        else:
            return jsonify(status="something went wrong"), 404
            # this would mean that the _id was not found. Not possible, unless
            # another program manually modified the _id inbetween getting
            # the table, and sending the patch request.
