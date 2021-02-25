ILLEGAL_CHARS = [
    '<', '>', '/', '\\', '?'
]


# verify password makes sure that the login and password isn't empty and
# doesn't contain any illegal characters such as: < > /
def verify_password(usrname, pwd):
    """
    :param usrname: username
    :type usrname: str
    :param pwd: password
    :type pwd: str
    :rtype : dict
    """
    errors = {'username': [], 'password': []}
    if usrname.strip() == '':
        errors['username'].append('Username must not be empty')
    if pwd.strip() == '':
        errors['password'].append('Password must not be empty')
    for ill_char in ILLEGAL_CHARS:
        if ill_char in usrname:
            errors['username'].append("Illegal character detected: {}"
                                      .format(ill_char))
        if ill_char in pwd:
            errors['password'].append("Illegal character detected: {}"
                                      .format(ill_char))
    return errors
