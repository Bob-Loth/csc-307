import requests
from flask import jsonify
import pymongo
import json
from bson.objectid import ObjectId
from private_credentials import credentials


base_url = 'http://localhost:5000/'
header = {'content-type': 'application/json'}


class TestRegister():
    # should return 409, indicating that User is already registered.
    def test_register_duplicate(self):
        data_to_send = {'name': 'User', 'pwd': 'password'}
        r = requests.post(base_url + 'register', data=json.dumps(data_to_send),
                          headers=header)
        assert r.status_code == 409
        assert r.json()['success'] is False
        assert r.json()['errors']['username'] == ['User already registered']

    # should return 409, indicating that illegal characters were detected.
    def test_register_bad_username_password(self):
        data_to_send = {'name': 'gawe>bWE', 'pwd': '/aErg'}
        r = requests.post(base_url + 'register', data=json.dumps(data_to_send),
                          headers=header)
        assert r.status_code == 409
        assert r.json()['errors']['username'] == ['Illegal character' +
                                                  ' detected: >']
        assert r.json()['errors']['password'] == ['Illegal character' +
                                                  ' detected: /']

        # assert that no user was created with invalid name/pwd
        conn = pymongo.MongoClient(credentials(), 27017)
        db = conn['InventoryDB']['users']
        del_op = db.delete_one({'username': 'gawe>bWE'})
        conn.close()
        assert del_op.deleted_count == 0

    # should return 409, indicating that username or password was empty
    def test_register_empty_username_password(self):
        data_to_send = {'name': '', 'pwd': ''}
        r = requests.post(base_url + 'register', data=json.dumps(data_to_send),
                          headers=header)
        assert r.status_code == 409
        assert r.json()['errors']['username'] == ['Username must not be empty']
        assert r.json()['errors']['password'] == ['Password must not be empty']

        # assert that no user was created with invalid name/pwd
        conn = pymongo.MongoClient(credentials(), 27017)
        db = conn['InventoryDB']['users']
        del_op = db.delete_one({'username': ''})
        conn.close()
        assert del_op.deleted_count == 0

    # should return 201, indicating that user was successfully registered.
    def test_register_success(self):
        header = {'content-type': 'application/json'}
        data_to_send = {'name': 'test-bfghaWBJJefluigyh', 'pwd': 'p1234'}
        r = requests.post(base_url + 'register', data=json.dumps(data_to_send),
                          headers=header)
        assert r.status_code == 201
        assert r.json()['success'] is True
        assert r.json()['errors']['username'] == []
        assert r.json()['errors']['password'] == []

        # cleanup of registered test user
        conn = pymongo.MongoClient(credentials(), 27017)
        db = conn['InventoryDB']['users']
        del_op = db.delete_one({'username': 'test-bfghaWBJJefluigyh'})
        conn.close()
        assert del_op.deleted_count == 1
