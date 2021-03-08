import React from 'react'
import {Table} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

function ListView({listName, secondHeaderField, products}) {
    return (
        <div>
            <h1>{listName}</h1>
            <Table compact>
                <Table.Header>
                    <Table.HeaderCell>name</Table.HeaderCell>
                    <Table.HeaderCell>{secondHeaderField}</Table.HeaderCell>
                </Table.Header>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>
                            {products.pName}
                        </Table.Cell>
                        <Table.Cell>
                            {products.additionalField}
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </div>
    )
}

export default ListView
