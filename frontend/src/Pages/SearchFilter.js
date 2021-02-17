/* eslint-disable no-unused-vars */
import React, {useState} from 'react'
import {Button, Table, TableBody, Header, Rating} from 'semantic-ui-react'
import {useForm} from "../Utils/hooks";
import axios from 'axios'
import TableSorter from "../Components/TableSorter";

function SearchFilter() {

    const login_url_string = "http://localhost:5000/search";

    return (
        <div>
            <TableSorter/>
        </div>
    )

}

export default SearchFilter