import requests
from flask import jsonify
import pymongo
import json
from bson.objectid import ObjectId
from private_credentials import credentials


base_url = 'http://localhost:5000/'
header = {'content-type': 'application/json'}


class TestSearch():
    # verifies that all products were returned, and their arguments exist
    # and are of valid size
    def test_list_all(self):
        r = requests.get(base_url + 'search')

        assert r.json()
        for product in r.json()['products']:
            assert product['name']
            assert len(product['expiration_date']) == 3 or \
                len(product['expiration_date']) == 10
            assert len(product['sku']) == 12
            assert product['category']
            assert product['price'] >= 0
            assert 3 < len(product['shipment_batch']) < 10
        assert len(r.json()['products']) == 20
        assert r.status_code == 200

    def test_update_one(self):
        data_to_send = {'name': 'Dishwashing Machine'}
        r = requests.patch(base_url + 'search', 
                           data=json.dumps(data_to_send),
                           params={'_id': \
                                   "603dc23efb89b823bcc0ce98"},
                           headers=header)
        print(r.text)
        assert r.text
        assert r.status_code == 205

        data_to_send2 = 'Dishwasher'
        r2 = requests.patch(base_url + 'search', 
                           data=json.dumps(data_to_send2),
                           params={'_id': \
                                   "603dc23efb89b823bcc0ce98"},
                           headers=header)
        
        assert r2.json()['name'] == 'Dishwasher'
        assert r2.status_code == 205
        
                           