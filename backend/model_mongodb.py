import pymongo

import time
from datetime import date, datetime, timedelta
import json
from bson import json_util
from bson.objectid import ObjectId
try:
    from private_credentials import credentials
except ModuleNotFoundError:
    def credentials():
        return 'localhost'

from flask import jsonify


class Model(dict):
    """
    A simple model that wraps mongodb document
    """
    __getattr__ = dict.get
    __delattr__ = dict.__delitem__
    __setattr__ = dict.__setitem__

    def parse_json(self, data):
        return json.loads(json_util.dumps(data))

    def save(self):
        if not self._id:
            self.collection.insert(self)
        else:
            self.collection.update(
                {"_id": ObjectId(self._id)}, self)
        self._id = str(self._id)

    def reload(self):
        if self._id:
            result = self.collection.find_one({"_id": ObjectId(self._id)})
            if result:
                self.update(result)
                self._id = str(self._id)
                return True
        return False

    def remove(self):
        if self._id:
            resp = self.collection.remove({"_id": ObjectId(self._id)})
            self.clear()
            return resp


class Login(Model):
    def __init__(self, db_client=pymongo.MongoClient(credentials(), 27017),
                 collection=pymongo.MongoClient(credentials(), 27017)
                 ["InventoryDB"]["users"]):
        self.db_client = db_client
        self.collection = collection

    def find_name_ret_hash(self, username):
        users = list(self.collection.find({"username": username}))
        for user in users:
            user["_id"] = str(user["_id"])
        if len(users) == 1:
            return users[0]["password"]
        elif len(users) > 1:
            # app.logger.errors("Multiple users with same information")
            return False
        else:
            # app.logger.errors("User does not exist")
            return False


class Register(Model):
    db_client = pymongo.MongoClient(credentials(), 27017)
    collection = db_client["InventoryDB"]["users"]

    def register_user(self, user, hash):
        dup_users = list(self.collection.find({"username": str(user)}))
        if len(dup_users) != 0:
            # app.logger.errors("User " + str(user) + " already registered")
            return False
        else:
            # db_ret is the _id field of the registered user
            db_ret = self.collection.insert_one(
                {"username": user, "password": hash})
            return True


class Product(Model):
    db_client = pymongo.MongoClient(credentials(), 27017)
    collection = db_client["InventoryDB"]["InventoryColl"]

    def list_all(self):
        products = list(self.collection.find())
        for product in products:
            product["_id"] = str(product["_id"])
        return products

    # returns a list of products in filter_category that match filter_item
    def list_filter(self, filter_category, filter_item):
        filter_category = str(filter_category)
        products = list(self.collection.find({filter_category: filter_item}))
        return products

    # find_one_and_update returns original by default
    # AFTER specifies to return the modified document
    def list_update(self, id, updates):
        product = self.parse_json(self.collection.find_one_and_update(
            {"_id": ObjectId(id)},  # the filter
            {'$set': updates},    # the things to update
            new=True))  # return the updated object
        return product


class Search(Model):

    db_client = pymongo.MongoClient(credentials(), 27017)
    collection = db_client["InventoryDB"]["InventoryColl"]

    # def find(self, keyword):
    #     products = list(self.collection.find({"name": keyword}))
    #     print(keyword)
    #     for product in products:
    #         product["_id"] = str(product["_id"])
    #     return products

    def find_filter(self, keyword, filter_category, price_range, expiration):

        # get all products in collection
        products = list(self.collection.find())
        filteredProducts = []
        today = date.today()

        # workaround for above 50 filter
        temp_range = price_range
        if temp_range == 51:
            temp_range = 50

        for product in products:
            # name filter
            # filter based on name if keyword present
            if '' != keyword and keyword.lower() not in \
              product['name'].lower():
                continue

            # ---------------------------------------

            # category filter
            # filter based on category if filter is present
            if ('' != filter_category and
                    filter_category != product['category']):
                continue

            # ---------------------------------------

            # price range filter
            # filter based on price range if filter is present
            if price_range != 0:

                # for less than filters, if product price is above filter
                # price, remove product
                if price_range < 51 and price_range < product['price']:
                    continue
                # for greater than filters, if product price is below filter
                # price, remove product
                elif price_range >= 51:

                    # using workaround
                    if temp_range > product['price']:
                        continue

            # ---------------------------------------

            # filter based on price range if filter is present
            if '0' != expiration:

                # skip over if no expiry date
                if 'N/A' == product['expiration_date']:
                    continue

                dateToConvert = product['expiration_date']
                month = int(dateToConvert[0:2])
                day = int(dateToConvert[3:5])
                year = int(dateToConvert[6:])

                product_expiry = date(year, month, day)

                deadline = int(expiration)

                weeks = (((product_expiry - today).days) + 6) // 7
                print(weeks, deadline, weeks > deadline)

                if weeks > deadline:
                    continue

            filteredProducts.append(product)

        # last steps
        # Cast to list
        # finalize formatting
        for product in filteredProducts:
            product["_id"] = str(product["_id"])
        # --------------------------------------

        return filteredProducts

    def list_update(self, id, updates):
        product = self.parse_json(self.collection.find_one_and_update(
            {"_id": ObjectId(id)},  # the filter
            {'$set': updates},    # the things to update
            new=True))  # return the updated object
        return product

    # find_one_and_update returns original by default
    # AFTER specifies to return the modified document
