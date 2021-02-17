/* eslint-disable no-unused-vars */
import React, {useState} from 'react'
import _ from 'lodash'
import {Table} from 'semantic-ui-react'

import axios from 'axios'
import TableSorter from "../Components/TableSorter";


    const login_url_string = "http://localhost:5000/search";

    const tableData = [
    {"_id":{"$oid":"602c478f5830f02be4269737"},"name":"Assorted Spices","sku":"SKU#00001001","category":"Cooking","expiration_date":"2-16-2025","price":12.49,"shipment_batch":"S#45"},
    {"_id":{"$oid":"602c478f5830f02be4269738"},"name":"HDMI Adapter","sku":"SKU#00001002","category":"Electronics","expiration_date":"N/A","price":4.99,"shipment_batch":"S#45"},
    {"_id":{"$oid":"602c478f5830f02be4269739"},"name":"OJ Gallon","sku":"SKU#00001003","category":"Produce","expiration_date":"2-31-2021","price":5,"shipment_batch":"S#45"},
    {"_id":{"$oid":"602c478f5830f02be426973a"},"name":"Postage Stamp","sku":"SKU#00001004","category":"Miscellaneous","expiration_date":"N/A","price":0.05,"shipment_batch":"S#46"},
    {"_id":{"$oid":"602c478f5830f02be426973b"},"name":"Dishwasher","sku":"SKU#00001005","category":"Home Appliances","expiration_date":"N/A","price":950,"shipment_batch":"S#46"}
]

    function exampleReducer(state, action) {
        switch (action.type) {
          case 'CHANGE_SORT':
            if (state.column === action.column) {
              return {
                ...state,
                data: state.data.slice().reverse(),
                direction:
                  state.direction === 'ascending' ? 'descending' : 'ascending',
              }
            }
      
            return {
              column: action.column,
              data: _.sortBy(state.data, [action.column]),
              direction: 'ascending',
            }
          default:
            throw new Error()
        }
      }
      
    function TableExampleSortable() {
        const [state, dispatch] = React.useReducer(exampleReducer, {
            column: null,
            data: tableData,
            direction: null,
        })
        const { column, data, direction } = state


    return (
        <div>
            <TableSorter/>
        </div>
    )

}

export default TableExampleSortable