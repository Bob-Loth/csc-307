import React from 'react'
import {Table} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import { toArray } from 'lodash'

function ListView({listName, secondHeaderField, products}) {

    return (
        <div>
            <h1>{listName}</h1>
            <Table compact>
                <Table.Header>
                    <Table.Row>
                    <Table.HeaderCell>name</Table.HeaderCell>
                    <Table.HeaderCell>{secondHeaderField}</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {(products = toArray(products)) &&
                    products.map(({_id, name, expiration_date, stock}) => (
                    <Table.Row key={_id}>
                        <Table.Cell>
                            {name}
                        </Table.Cell>
                        <Table.Cell>
                            {((secondHeaderField === 'Stock Count') && stock) ||
                             ((secondHeaderField === 'Expiration Date') && expiration_date)}
                        </Table.Cell>
                    </Table.Row>
                    ))}

                </Table.Body>
            </Table>
        </div>
    )
}

export default ListView
