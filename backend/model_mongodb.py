import pymongo
from bson import ObjectId
from private_credentials import credentials


class Model(dict):
    """
    A simple model that wraps mongodb document
    """
    __getattr__ = dict.get
    __delattr__ = dict.__delitem__
    __setattr__ = dict.__setitem__

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


class User(Model):
    db_client = pymongo.MongoClient('localhost', 27017)
    collection = db_client["users"]["users_list"]

    def find_all(self):
        users = list(self.collection.find())
        for user in users:
            user["_id"] = str(user["_id"])
        return users

    def find_by_name_job(self, name, job):
        users = list(self.collection.find({"name": name, "job": job}))
        for user in users:
            user["_id"] = str(user["_id"])
        return users

    def find_by_name(self, name):
        users = list(self.collection.find({"name": name}))
        for user in users:
            user["_id"] = str(user["_id"])
        return users


class Login(Model):
    db_client = pymongo.MongoClient(credentials(), 27017)
    collection = db_client["InventoryDB"]["users"]

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
            db_ret = self.collection.insert_one({"username": user, "password": hash})
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

