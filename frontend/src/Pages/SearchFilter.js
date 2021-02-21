/* eslint-disable no-unused-vars */
import {Button, Table, TableBody, Header, Rating} from 'semantic-ui-react'
import axios from 'axios'
import React, {useEffect, useReducer, useState} from 'react'

import _ from 'lodash'



function SearchFilter() {

    const search_url_string = "http://localhost:5000/search";

    const [productList, setProductList] = useState([])

    function reducer(state, action) {
        switch (action.type) {
            case 'CHANGE_SORT':
                if (state.column === action.column) {
                    setProductList(productList.slice().reverse())
                    return {
                        ...state,
                        direction:
                            state.direction === 'ascending' ? 'descending' : 'ascending',
                    }
                }
                else {
                    setProductList(_.sortBy(productList, [action.column]));
                    return {
                        ...state,
                        column: action.column,
                        direction: 'ascending',
                    }}
            default:
                throw new Error()
        }
    }
    useEffect(() => {
        axios.get(search_url_string)
            .then(res => {
                setProductList(res.data.products); //{products=...,...,...}
                //console.log(res.data.products[0].name);
            })
    }, [])
    
    const [state, dispatch] = React.useReducer(reducer, 
        { column: null,
          direction: null})
    
    const { column, direction } = state;
    return (
        <div>
            <Table sortable celled fixed>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell
                        sorted={column === 'name' ? direction : null}
                        onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'name'})}>
                        Name
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        sorted={column === 'expiration_date' ? direction : null}
                        onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'expiration_date'})}>
                        Expiration Date
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        sorted={column === 'sku' ? direction : null}
                        onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'sku'})}>
                        SKU
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        sorted={column === 'category' ? direction : null}
                        onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'category'})}>
                        Category
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        sorted={column === 'price' ? direction : null}
                        onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'price'})}>
                        Price (USD)
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        sorted={column === 'shipment_batch' ? direction : null}
                        onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'shipment_batch'})}>
                        Shipment ID
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {productList.map(({name, expiration_date, sku, category, price, shipment_batch}) => (
                    <Table.Row key={name}>
                        <Table.Cell>{name}</Table.Cell>
                        <Table.Cell>{expiration_date}</Table.Cell>
                        <Table.Cell>{sku}</Table.Cell>
                        <Table.Cell>{category}</Table.Cell>
                        <Table.Cell>{price}</Table.Cell>
                        <Table.Cell>{shipment_batch}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
        </div>
    )

}

export default SearchFilter