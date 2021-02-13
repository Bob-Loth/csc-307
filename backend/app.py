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
        login = Login(login_attempt)
        
        # TODO: do password encryption here before sending to database
        # TODO: check if hashed password matches user in collection 'users'
        # if not, return response indicating unsuccessful login
        db_hash = login.find_name_ret_hash(login_attempt.get('name'))
        if db_hash == False: 
            resp = jsonify({"success": "false"})
            return resp
        
        match = verify(login_attempt.get('pwd'), db_hash)
        
        if match:
            resp = jsonify({"success": "true"})
        else:
            resp = jsonify({"success": "false"})
        
        # TODO: return response indicating successful login, redirect
        return resp
