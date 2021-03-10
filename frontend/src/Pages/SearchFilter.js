import {Table} from 'semantic-ui-react'
import axios from 'axios'
import React, {useEffect, useReducer, useState} from 'react'
import {useForm} from "../Utils/hooks";
import {Form, Button} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import ProductInfoModal from '../Components/ProductInfoModal'
import _ from 'lodash'


function SearchFilter() {
    const search_url_string = "http://localhost:5000/search";
    const [productList, setProductList] = useState([])
    const [exp, setExp] = useState('0')
    const [filterCategory, setCategory] = useState('')
    const [priceRange, setPriceRange] = useState('none')
    const [stockRange, setStockRange] = useState('none')

    const initialState = {
        keyword: '',
    }

    const {onChange, values} = useForm(searchForItems, initialState)

    function searchForItems() {       
        //once login button is clicked, send the fields to the backend and do
        //something with the response
        axios.get(search_url_string, {params: {
                                        'keyword': values.keyword,
                                        'expiry': exp,
                                        'filterCategory': filterCategory,
                                        'priceRange': priceRange,
                                        'stockRange': stockRange}})
          .then( (resp) => {
                setProductList(resp.data.products);
            });
    }


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
            })
    }, [])
    
    const [state, dispatch] = useReducer(reducer, 
        { column: null,
          direction: null})
    
    const { column, direction } = state;
    return (
        <div>
            <div>
                <Form onSubmit={searchForItems} noValidate className=''>
                  
                    <h1> Search </h1>
                    <Form.Input
                        placeholder='search...'
                        name='keyword'
                        value={values.keyword}
                        onChange={onChange}
                    />
                    <div>
                        <h4>Filters:</h4>
                        
                        Expiry
                        <select
                        value = {exp} 
                        onChange={(e) =>{
                            
                            const expiry = e.target.value;
                            setExp(expiry);
                        }}>
                            <option value='0'>None</option>
                            <option value='1'>Within One Week</option>
                            <option value='2'>Within Two Weeks</option>
                        </select>
                        Category
                        <select
                        value = {filterCategory} 
                        onChange={(e) =>{
                            
                            const cat = e.target.value;
                            setCategory(cat);
                        }}>
                            <option value=''>None</option>
                            <option value='Cooking'>Cooking</option>
                            <option value='Electronics'>Electronics</option>
                            <option value='Home Appliances'>Home Appliances</option>
                            <option value='Miscellaneous'>Miscellaneous</option>
                            <option value='Poultry'>Poultry</option>
                            <option value='Produce'>Produce</option>
                        </select>
                        Price Range
                        <select
                        value = {priceRange} 
                        onChange={(e) =>{
                            
                            const pr = e.target.value;
                            setPriceRange(pr);
                        }}>
                            <option value="none">None</option>
                            <option value="<10">Below $10</option>
                            <option value="<20">Below $20</option>
                            <option value="<30">Below $30</option>
                            <option value="<50">Below $50</option>
                            <option value=">50">Above $50</option>
                            <option value=">100">Above $100</option>
                        </select>
                        Stock Range
                        <select
                        value = {stockRange} 
                        onChange={(e) =>{
                            
                            const sr = e.target.value;
                            setStockRange(sr);
                        }}>
                            <option value="none">none</option>
                            <option value="<10">Below 10</option>
                            <option value="<50">Below 50</option>
                            <option value=">50">Above 50</option>
                            <option value=">100">Above 100</option>
                        </select>

                    </div>
                    <br/>
                    <Button type='submit' primary>
                        Search
                    </Button>
                    <Button onClick={() => {
                        values.keyword=''
                        setPriceRange('none')
                        setCategory('')
                        setExp('0')
                        setStockRange('none')
                    }}>
                        Clear Filters
                    </Button>
                </Form>
            </div>
            <p/>

            <div>
                <Table sortable celled fixed>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>

                        </Table.HeaderCell>
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
                        <Table.HeaderCell
                            sorted={column === 'stock' ? direction : null}
                            onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'stock'})}>
                            Stock Count
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {productList.map(({_id, name, expiration_date, sku, category, price, shipment_batch, stock}) => (
                        <Table.Row key={_id}>
                            <Table.HeaderCell>
                            <ProductInfoModal
                            _id={_id}
                            name={name}
                            expiration_date={expiration_date}
                            sku={sku}
                            category={category}
                            price={price}
                            shipment_batch={shipment_batch}
                            stock={stock}
                            >
                            </ProductInfoModal>
                            </Table.HeaderCell>
                            <Table.Cell>{name}</Table.Cell>
                            <Table.Cell>{expiration_date}</Table.Cell>
                            <Table.Cell>{sku}</Table.Cell>
                            <Table.Cell>{category}</Table.Cell>
                            <Table.Cell>{price}</Table.Cell>
                            <Table.Cell>{shipment_batch}</Table.Cell>
                            <Table.Cell>{stock}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            </div>
        </div>
    )

}

export default SearchFilter