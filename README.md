# csc-307
### Project Description

This project offers a fairly simple login/register interface, and authentication-protected views of a database describing various products of a template store's inventory. Users can login, logout, view the list of products and their various properties, filter the list using multiple filter criteria, and edit properties of a particular product.

### Figma Prototype
[Figma link](https://www.figma.com/file/QQCNWJnSh4qpgdr3v2G1LP/Untitled?node-id=0%3A1) Time estimate as described in [issue #2](https://github.com/Bob-Loth/csc-307/issues/2) (3 hours estimated, 4 hours actual)

### Development Environment Setup

This application is built using React, Flask, and MongoDB. 

Steps to run:
1. Clone repository.
2. The frontend folder contains React code. Navigate to it, and run "npm install" This should install dependencies contained in package.json. Be sure to install npm and node.js first from your package manager or their websites.
3. The backend folder contains Flask code, as well as pymongo helper functions to access a template MongoDB database.
Navigate to this directory, and run "pip install -r requirements.txt."
4. Now, we should have covered installation. As this project works on a MongoDB cloud database that requires credentials to use, the file backend/private_credentials.py offers a way to access it. Simply set the environment variables "MONGO_username" and "MONGO_password" to your username and password, and replace the link with your own database, or request access by direct-messaging Bob-Loth on github.
5.  We can start up the Flask server by running "python -m flask run" in the backend folder.
6. In a separate terminal, we can start up the React frontend view by running "npm start" in the frontend folder.
7. The testing suite includes tests that require the Flask server to be running. Before running all tests in the test suite, start up the Flask server.
8. To run the full testing suite, run "python -m pytest ." in the backend directory.

### CI status
| Branch | Status |
|---|---|
|dev|[![Build Status](https://travis-ci.com/Bob-Loth/csc-307.svg?branch=dev)](https://travis-ci.com/Bob-Loth/csc-307)|
|main| [![Build Status](https://travis-ci.com/Bob-Loth/csc-307.svg?branch=main)](https://travis-ci.com/Bob-Loth/csc-307)|
|bob|[![Build Status](https://travis-ci.com/Bob-Loth/csc-307.svg?branch=bob)](https://travis-ci.com/Bob-Loth/csc-307)|
|david|[![Build Status](https://travis-ci.com/Bob-Loth/csc-307.svg?branch=david)](https://travis-ci.com/Bob-Loth/csc-307)|

### Style Guide

For code submitted to frontend, we plan on using the recommended settings for eslint and the react-plugin for eslint.

For code submitted to backend, we plan on conforming to the pep8 standard by usage of pycodestyle, formerly known as pep8 (pip install pycodestyle)



### Use Case Diagram
![image](./documentation/Use-Cases(1).png)
### Class Diagram
![image](documentation/UML-Diagram.png)
