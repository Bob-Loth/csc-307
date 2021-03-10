import requests
from flask import jsonify
import pymongo
import json
from bson.objectid import ObjectId
try:
    from private_credentials import credentials
except ModuleNotFoundError:
    def credentials():
        return 'localhost'


base_url = 'http://localhost:5000/'
header = {'content-type': 'application/json'}


class TestLogin():
    # tests to see that a failure is returned when logging in with a
    # nonexistent user
    def test_login_failure_non_existent(self):
        data_to_send = {'name': 'NotHere-abhwergtdfd', 'pwd': 'aErgUYbjhertJT'}
        r = requests.post(base_url + 'login', data=json.dumps(data_to_send),
                          headers=header)
        assert r.status_code == 401
        assert r.json()['success'] is False
        assert r.json()['errors']['username'] == []
        assert r.json()['errors']['password'] == []
        assert r.json()['hash'] == 'false'

    # user "User" exists in database, but incorrect, valid
    # password was provided.
    # Tests to see if this correctly returns an error.
    def test_login_failure_incorrect_password(self):
        data_to_send = {'name': 'User', 'pwd': 'not-password'}
        r = requests.post(base_url + 'login', data=json.dumps(data_to_send),
                          headers=header)
        assert r.status_code == 401
        assert r.json()['success'] is False
        assert r.json()['errors']['username'] == []
        assert r.json()['errors']['password'] == []
        assert r.json()['verify'] == 'false'

    def test_login_success(self):
        data_to_send = {'name': 'User', 'pwd': 'password'}
        r = requests.post(base_url + 'login', data=json.dumps(data_to_send),
                          headers=header)
        assert r.status_code == 200
        assert r.json()['success'] is True
        assert r.json()['errors']['username'] == []
        assert r.json()['errors']['password'] == []
        assert r.json()['jwtToken']  # checks for the existence of a token sent
