import requests
from flask import jsonify
import pymongo
import json
from bson.objectid import ObjectId
from private_credentials import credentials
from model_mongodb import *
from datetime import date, datetime, timedelta
import time

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
            assert len(product['expiration_date']) == 10
            assert len(product['sku']) == 12
            assert product['category']
            assert product['price'] >= 0
            assert 3 < len(product['shipment_batch']) < 10
        assert len(r.json()['products']) == 20
        assert r.status_code == 200

    # verifies that multiple fields can be changed with one patch request,
    # and that the returned JSON contains the modified object.
    def test_update_one_success(self):
        data_to_send = {'name': 'Dishwashing Machine', 'price': 6.00}
        r = requests.patch(base_url + 'search?_id=603dc23efb89b823bcc0ce98',
                           data=json.dumps(data_to_send),
                           headers=header)

        assert r.status_code == 205
        assert r.json()['price'] == 6.00
        assert r.json()['name'] == 'Dishwashing Machine'

        data_to_send2 = {'name': 'Dishwasher', 'price': 999.99}
        r2 = requests.patch(base_url + 'search?_id=603dc23efb89b823bcc0ce98',
                            data=json.dumps(data_to_send2),
                            headers=header)

        assert r2.status_code == 205
        assert r2.json()['price'] == 999.99
        assert r2.json()['name'] == 'Dishwasher'

    # verifies that if, for some reason, an incorrect _id was specified,
    # a 404 response code and a status field is returned. As the react app
    # does not provide any functionality to modify the _id, this error means
    # that an external program modified the _id in between getting the table,
    # and sending the patch request.
    def test_update_one_failure(self):
        data_to_send = {'name': 'Dishwashing Machine', 'price': 6.00}
        r = requests.patch(base_url + 'search?_id=cccccccccccccccccccccccc',
                           data=json.dumps(data_to_send),
                           headers=header)

        assert r.status_code == 404
        assert r.json()['status'] == 'something went wrong'

    # tests the find filter function in model_mongodb with various inputs
    # making sure that they successfully return the expected items
    def test_find_filter(self):

        # create productdb
        productdb = Search()

        # set filters to default / null values
        keyword = ''
        filter_category = ''
        price_range = 0.0
        expiration = '0'
        greaterThan = False
        stockAbove = False
        stock_range = 0.0

        # search with default / null values
        products_one = productdb.find_filter(keyword, filter_category,
                                             price_range, expiration,
                                             greaterThan, stockAbove,
                                             stock_range)

        # assertion checks
        for product in products_one:
            assert product['name']
            assert len(product['expiration_date']) == 10
            assert len(product['sku']) == 12
            assert product['category']
            assert product['price'] >= 0
            assert product['stock']
            assert 3 < len(product['shipment_batch']) < 10
        assert len(products_one) == 20

        # set filters for keyword, category, stock range
        keyword = 'po'
        filter_category = 'Produce'
        price_range = 0.0
        expiration = '0'
        greaterThan = False
        stockAbove = True
        stock_range = 50

        # search with above filters
        products_two = productdb.find_filter(keyword, filter_category,
                                             price_range, expiration,
                                             greaterThan, stockAbove,
                                             stock_range)

        # assertion checks
        for product in products_two:
            assert 'po' in product['name'].lower()
            assert product['category'] == 'Produce'
            assert product['price'] >= 0
            assert product['stock'] >= 50

        # set filters for expiration, price range
        keyword = ''
        filter_category = ''
        price_range = 30
        expiration = '2'
        greaterThan = False
        stockAbove = False
        stock_range = 0

        # search with above filters
        products_two = productdb.find_filter(keyword, filter_category,
                                             price_range, expiration,
                                             greaterThan, stockAbove,
                                             stock_range)

        deadline = (datetime.now() +
                    timedelta(weeks=2)
                    )

        # assertion checks
        for product in products_two:
            assert product['price'] <= 30
            expiry = date.fromisoformat(product['expiration_date'])
            assert deadline >= datetime(expiry.year, expiry.month, expiry.day)

        # set price range to below 10, stock range above 50
        price_range = 10
        stock_range = 50
        stockAbove = True
        expiration = '0'

        # find with filters
        products_two = productdb.find_filter(keyword, filter_category,
                                             price_range, expiration,
                                             greaterThan, stockAbove,
                                             stock_range)

        # assertion checks
        for product in products_two:
            assert product['price'] <= 10
            assert product['stock'] >= 50

        # set price range to above 50
        price_range = 50
        greaterThan = True
        stock_range = 0
        stockAbove = False

        # find with filters
        products_two = productdb.find_filter(keyword, filter_category,
                                             price_range, expiration,
                                             greaterThan, stockAbove,
                                             stock_range)

        # assertion checks
        for product in products_two:
            assert product['price'] >= 50

        # set price range to above 50
        price_range = 0
        greaterThan = False
        stock_range = 30
        stockAbove = False

        # find with filters
        products_two = productdb.find_filter(keyword, filter_category,
                                             price_range, expiration,
                                             greaterThan, stockAbove,
                                             stock_range)

        # assertion checks
        for product in products_two:
            assert product['stock'] <= 30
