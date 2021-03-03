import pytest
from Verification import verify_password

"""
    backend test cases for endpoint resolvers
"""


# empty username testing
def test_verify_empty_username():
    username = ''
    password = 'helloworld'
    errors = {
        'username': ['Username must not be empty'],
        'password': []
    }
    assert verify_password(username, password) == errors


# empty password testing
def test_verify_empty_password():
    username = 'helloworld'
    password = ''
    errors = {
        'username': [],
        'password': ['Password must not be empty'],
    }
    assert verify_password(username, password) == errors


# empty username and  password testing
def test_verify_empty_username_pass():
    username = ''
    password = ''
    errors = {
        'username': ['Username must not be empty'],
        'password': ['Password must not be empty']
    }
    assert verify_password(username, password) == errors


# single illegal char username
def test_verify_single_illegal_usrname():
    username = 'hello>'
    password = 'hello'
    errors = {
        'username': ['Illegal character detected: >'],
        'password': []
    }
    assert verify_password(username, password) == errors


# single illegal char password
def test_verify_single_illegal_pwd():
    username = 'hello'
    password = '<hello'
    errors = {
        'username': [],
        'password': ['Illegal character detected: <']
    }
    assert verify_password(username, password) == errors


# multiple illegal username
def test_verify_mult_ill_username():
    username = '<?hello>'
    password = 'hello'
    errors = {
        'username': ['Illegal character detected: <',
                     'Illegal character detected: >',
                     'Illegal character detected: ?'],
        'password': []
    }
    assert verify_password(username, password) == errors


# multiple illegal username
def test_verify_mult_ill_username_pass():
    username = '<?hello>'
    password = '/hello\\'
    errors = {
        'username': ['Illegal character detected: <',
                     'Illegal character detected: >',
                     'Illegal character detected: ?'],
        'password': ['Illegal character detected: /',
                     'Illegal character detected: \\']
    }
    assert verify_password(username, password) == errors
