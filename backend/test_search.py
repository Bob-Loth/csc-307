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
