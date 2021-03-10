import pymongo
from format_date import to_ymd
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
from pymongo.collation import Collation, CollationStrength


class Model(dict):
    def parse_json(self, data):
        return json.loads(json_util.dumps(data))


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
            return False
        else:
            return False


class Register(Model):
    db_client = pymongo.MongoClient(credentials(), 27017)
    collection = db_client["InventoryDB"]["users"]

    def register_user(self, user, hash):
        dup_users = list(self.collection.find({"username": str(user)}))
        if len(dup_users) != 0:
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
            product["expiration_date"] = to_ymd(product["expiration_date"])
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

    def get_sorted_limit(self, filter, num_docs):
        products = list(self.collection.find()
                        .sort(filter, pymongo.ASCENDING).limit(num_docs))
        for product in products:
            product["_id"] = str(product["_id"])
            product["expiration_date"] = to_ymd(product["expiration_date"])
        return jsonify(products)

    # @Params:
    # keyword: str | searches items with keyword as substring of item name
    # filter_category: str | searches for items in category
    # price_range: int | sets price comparison argument of price filter
    # expiration: str | converted to int between 0-2 as number of weeks
    #     until expiry
    # greaterThan: bool | sets comparison for price_range to search gte
    # stockAbove: bool | sets comparison for stock_range to search gte
    # stock_range: int | sets stock comparison argument of stock filter
    def find_filter(self, keyword, filter_category,
                    price_range, expiration, greaterThan,
                    stockAbove, stock_range):

        # get all products in collection
        query = {}

        # name filter
        # filter based on name if keyword present
        if ('' != keyword):

            query['name'] = {'$regex': keyword, "$options": 'i'}

        # ---------------------------------------

        # category filter
        # filter based on category if filter is present
        if ('' != filter_category):
            query['category'] = filter_category
        # ---------------------------------------

        # price range filter
        # filter based on price range if filter is present
        if price_range != 0:

            # for less than filters, if product price is above filter
            # price, remove product
            if greaterThan:
                query['price'] = {'$gte': price_range}

            # for greater than filters, if product price is below filter
            # price, remove product
            elif not greaterThan:
                # using workaround
                query['price'] = {'$lte': price_range}
        # ---------------------------------------

        # stock range filter
        # filter based on stock range if filter is present
        if stock_range != 0:

            # for less than filters, if product stock is above filter
            # stock, remove product
            if stockAbove:
                query['stock'] = {'$gte': stock_range}

            # for greater than filters, if product stock is below filter
            # stock, remove product
            elif not stockAbove:
                # using workaround
                query['stock'] = {'$lte': stock_range}
        # ---------------------------------------

        # date time query filter
        if '0' != expiration:

            # voodoo magic
            deadline = (datetime.now() +
                        timedelta(weeks=int(expiration))
                        )

            query['expiration_date'] = {'$lte': deadline}

        products = (
            list(self.collection.find(query).
                 collation(Collation(locale='en',
                           strength=CollationStrength.SECONDARY)))
        )

        # last steps
        # Cast to list
        # finalize formatting
        for product in products:
            product["_id"] = str(product["_id"])
            product["expiration_date"] = to_ymd(product["expiration_date"])
        # --------------------------------------

        return products
    # find_one_and_update returns original by default
    # AFTER specifies to return the modified document
