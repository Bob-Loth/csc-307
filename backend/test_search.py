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
            assert len(product['expiration_date']) == 29
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
