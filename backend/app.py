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
        
        # TODO: do password encryption here before sending to database
        # TODO: check if hashed password matches user in collection 'users'
        # if not, return response indicating unsuccessful login
        db_hash = login.find_name_ret_hash(username)
        if db_hash == False:
            resp = jsonify(success=False, errors=verify_password(username, password))
            return resp
        
        match = verify(password, db_hash)
        
        if match:
            resp = jsonify(success=True, errors=verify_password(username, password))
        else:
            resp = jsonify(success=False, errors=verify_password(username, password))
        
        # TODO: return response indicating successful login, redirect
        return resp
