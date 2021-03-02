from passlib.hash import pbkdf2_sha256


def encrypt(pwd):
    pwd = str(pwd)  # pwd must be unicode, string type is unicode in python3
    return pbkdf2_sha256.hash(pwd)


def verify(pwd, hash):
    pwd = str(pwd)
    return pbkdf2_sha256.verify(pwd, hash)
