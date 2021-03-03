#  testing encrypt and verify to make sure they correctly mirror each other
import pytest
from hash import encrypt, verify


#  an empty password
def test_encrypt_verify_empty():
    passwd = ""
    hash = encrypt(passwd)
    assert(verify(passwd, hash))


#  a password containing [a-z][A-Z][0-9] characters
def test_encrypt_verify_simple():
    passwd = "exAmPle2"
    hash = encrypt(passwd)
    assert(verify(passwd, hash))


#  a password containing non-standard characters
def test_encrypt_verify_weird():
    passwd = "\n18(~/"
    hash = encrypt(passwd)
    assert(verify(passwd, hash))


#  a longer than usual password.
def test_encrypt_verify_long():
    passwd = "reallllllllllllllllllllllllllllllllllllllllllllllllllllll" + \
        "lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllly long"
    hash = encrypt(passwd)
    assert(verify(passwd, hash))
