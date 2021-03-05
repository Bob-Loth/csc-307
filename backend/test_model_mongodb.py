import pytest
from model_mongodb import *


def test_inventory_find_one(mongodb):
    assert 'InventoryColl' in mongodb.list_collection_names()
    grapes = mongodb.InventoryColl.find_one({'name': 'Grapes'})
    assert grapes['category'] == 'Produce'


def test_inventory_find_one_and_update(mongodb):
    assert 'InventoryColl' in mongodb.list_collection_names()
    grapes = mongodb.InventoryColl.find_one({'name': 'Grapes'})
    assert str(grapes['_id']) == '602c478f5830f02be4269738'
