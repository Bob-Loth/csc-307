import os


def credentials():
    username = os.getenv("MONGO_username")  # insert mongodb username here
    password = os.getenv("MONGO_password")  # insert mongodb password here
    cred = ('mongodb+srv://' + username + ':' +
            password + '@inventorydb.zhcq6.mongodb.net')
    return cred
