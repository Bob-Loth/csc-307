from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS
from model_mongodb import *

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
        if db_hash == False:
            resp = jsonify(success=False, errors=verify_password(username, password))
            return resp
        
        match = verify(password, db_hash)
        
        if match:
            resp = jsonify(success=True, errors=verify_password(username, password))
        else:
            resp = jsonify(success=False, errors=verify_password(username, password))
        
        return resp

@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        name = request.get_json().get('name')
        pwd = request.get_json().get('pwd')

        errors = verify_password(name, pwd)
        if not errors:
            new_user = Register(request.get_json())
            if new_user.register_user(name, encrypt(pwd)):
                resp = jsonify(success=True, errors=errors)
            else:
                resp = jsonify(success=False, errors=errors)
            return resp
        else:
            return jsonify(success=False, errors=errors)

@app.route('/dashboard', methods=['POST'])
def dashboard():
	return "dashboard"

