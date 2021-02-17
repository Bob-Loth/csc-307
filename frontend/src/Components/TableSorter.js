



function TableSorter(props) {
    
    
    
    console.log("props: ", typeof(props));
    return (
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
                {data.map(({name, expiration_date, sku, category, price, shipment_batch}) => (
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
    )
}

export default TableSorter