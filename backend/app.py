from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS
from model_mongodb import *
import jwt

from hash import *
from utils.Verification import verify_password

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
            'jwtToken': user
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
            new_user.register_user(name, encrypt(pwd))
            resp = jsonify(success=True, errors=errors)
            return resp, 201
        else:
            resp = jsonify(success=False, errors=errors)
            return resp, 409


@app.route('/dashboard', methods=['POST'])
def dashboard():
    return "dashboard"


@app.route('/search', methods=['GET'])
def search():
    if request.method == 'GET':
        productdb = Product()
        products = productdb.list_all()
        return jsonify(products=products)
