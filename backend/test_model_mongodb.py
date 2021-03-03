import pytest
from model_mongodb import *


def test_inventory(mongodb):
    assert 'InventoryColl' in mongodb.list_collection_names()
    grapes = mongodb.InventoryColl.find_one({'name': 'Grapes'})
    assert grapes['category'] == 'Produce'
