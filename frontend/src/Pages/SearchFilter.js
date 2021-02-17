/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react'
import {Button, Table, TableBody, Header, Rating} from 'semantic-ui-react'
import axios from 'axios'
import TableSorter from "../Components/TableSorter";


function SearchFilter() {

    const login_url_string = "http://localhost:5000/search";

    const [productList, setProductList] = useState([])

    useEffect(() => {
        axios.get(login_url_string)
            .then(res => {
                setProductList(res.data.products);
                //console.log("string here:");
                //console.log(res.data.products[0].name);
            })
    }, [])
    return (
        <div>
            {console.log(productList)}
            <TableSorter products={productList}/>
        </div>
    )

}

export default SearchFilter