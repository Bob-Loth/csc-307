import requests
from flask import jsonify
import pymongo
import json
from bson.objectid import ObjectId
from private_credentials import credentials


base_url = 'http://localhost:5000/'
header = {'content-type': 'application/json'}


class TestDashboard():
    # makes sure the returned list is sorted by stock in nonstrictly
    # ascending order
    def test_get_sorted_limit_stock(self):
        r = requests.get(base_url + '/dashboard/lowstock')

        assert r.status_code == 200
        min_stock = 0
        for product in r.json():
            assert product['name']
            assert len(product['expiration_date']) == 10
            assert len(product['sku']) == 12
            assert product['category']
            assert product['price'] >= 0
            assert 3 < len(product['shipment_batch']) < 10

            assert product['stock'] >= min_stock
            min_stock = product['stock']
        assert len(r.json()) == 5

    # makes sure the returned list is sorted by date in nonstrictly
    # ascending order
    def test_get_sorted_limit_date(self):
        r = requests.get(base_url + '/dashboard/expiry')
        assert r.status_code == 200
        min_date = ""
        for product in r.json():
            assert product['name']
            assert len(product['expiration_date']) == 10
            assert len(product['sku']) == 12
            assert product['category']
            assert product['price'] >= 0
            assert 3 < len(product['shipment_batch']) < 10

            assert product['expiration_date'] >= min_date
            min_date = product['expiration_date']
        assert len(r.json()) == 5
