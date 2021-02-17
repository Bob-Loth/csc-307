/* eslint-disable no-unused-vars */
import React, {useState} from 'react'
import {Button, Table, TableBody, Header, Rating} from 'semantic-ui-react'
import {useForm} from "../Utils/hooks";
import axios from 'axios'

function SearchFilter() {

    const login_url_string = "http://localhost:5000/search";

    return (
        <div>
            <Table sortable celled fixed>
                <Table.Header>
                    <Table.Row>

                    </Table.Row>
                </Table.Header>
                <Table.Body>

                </Table.Body>
            </Table>
        </div>
    )

}

export default SearchFilter