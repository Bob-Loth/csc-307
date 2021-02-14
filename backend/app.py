from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS



app = Flask(__name__)
CORS(app)


@app.route('/')
def home():
    return "Home"

@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        name = request.get_json().get('name')
        passwd = request.get_json().get('pwd')
        
        #TODO: do password encryption here before sending to database
        #TODO: check if hashed password matches user in collection 'users'
            #if not, return response indicating unsuccessful login
        #TODO: return response indicating successful login, redirect

        resp = jsonify(success= True)
        return resp



@app.route('/register', methods=['POST'])
def register():
	if request.method == 'POST':
		name = request.get_json().get('name')
		passwd = request.get_json().get('pwd')
		resp = jsonify(username = name, password = passwd)
		return resp

@app.route('/dashboard', methods=['POST'])
def dashboard():
	return "dashboard"