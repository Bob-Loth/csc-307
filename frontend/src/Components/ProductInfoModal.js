import React, {useState} from 'react'
import {useForm} from '../Utils/hooks'
import axios from 'axios'
import { Button, Modal, Form } from 'semantic-ui-react'
import { isNull } from 'lodash';

function ProductInfoModal(props){
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState("");
  const search_url_string = "http://localhost:3000/product"
  const initialState = {
    name: props.name,
    sku: props.sku,
    category: props.category,
    expiration_date: props.expiration_date,
    price: props.price,
    shipment_batch: props.shipment_batch
  }

  const {onChange, values} = useForm(editProductCallback, initialState)

  // gives message if no changes are made, or formatting isn't correct.
  // returns errors if anything went wrong.
  function editFormatting() {
    let price = parseFloat(values.price, 10)
    console.log("item.price",values.price)
    console.log("price",price)
    // round price to 2 decimal places, return errors if not a positive number
    if (isNaN(price)){
      console.log(typeof(price),typeof(values.price),price,values.price)
      return "Price must be a number"
    }
    else if (price < 0){
      return "Price must be a positive number"
    }
    else{
      price = price.toFixed(2)
    }
    // sku's first 4 characters must be SKU#, and the following
    // number must be 8 digits long, exactly
    const regexSku = new RegExp('^SKU#\\d{8}$');
    if (!regexSku.test(values.sku)){//if not an 8 digit number
      return "SKU code number must be 8 digits and start with 'SKU#'"
    }
    // Shipment must be in format "S#digits, from 1 up to 8 digits"
    const regexShipment = new RegExp('^S#[0-9]{1,8}$')
    if (!regexShipment.test(values.shipment_batch)){
      return "Shipment must be of the form S#N, " + 
                      "where N is a 1-8 digit number"
    }
    // a date, of the format m-d-y. m and d can be either 1-2 digits.
    //m must be 1-12. d must be 1-31. 
    // y must be 4 digits, and between 1900 and 2199.
    const regexDate = new RegExp('^((1[0-2]|[1-9])-(3[01]|[12][0-9]|[1-9])' + 
    '-(19[0-9]{2}|2[0-1][0-9]{2}))|(N/A)$') // <- this part is the -y, above are m-d
    if (!regexDate.test(values.expiration_date)){
      return "Date must be of the format m-d-y.\n" +
                      "Valid month: 1-12\n" +
                      "Valid day: 1-31\n" +
                      "Valid year: 1900-2199\n" +
                      "Optionally, 'N/A' should be used for items with no" + 
                      "expiration date."
    }
    return null
  }

  function editProductCallback() {
    setOpen(false);
    axios.patch(search_url_string,{
      'name': props.name,
      'sku': values.sku,
      'category': values.category,
      'expiration_date': values.expiration_date,
      'price': values.price,
      'shipment_batch': values.shipment_batch})
        .then( (resp) => {
            console.log(resp.data)
        })
        .catch(err => {
            if (err.response) {
                console.log(err.response.data)
            }
        });
}

  return(
    <Modal
    onClose={() => setOpen(false)}
    onOpen={() => setOpen(true)}
    open={open}
    trigger={<Button fluid>Edit<br></br>{props.name}</Button>}>

      <Modal.Header>Product Info:</Modal.Header>
      <Modal.Content>
        <Modal.Description>
        <div className='form-container'>
            <Form onSubmit={editProductCallback} noValidate className=''>
                <h1> Edit a product&apos;s information, then press submit, or exit. </h1>
                <Form.Input
                    label='Name'
                    placeholder='New Product Name'
                    name='name'
                    value={values.name}
                    onChange={onChange}
                />
                <Form.Input
                    label='SKU'
                    placeholder='New SKU#...'
                    name='sku'
                    value={values.sku}
                    onChange={onChange}
                />
                <Form.Input
                    label='Category'
                    placeholder='New Category'
                    name='category'
                    value={values.category}
                    onChange={onChange}
                />
                <Form.Input
                    label='Expiration Date'
                    placeholder='New m-d-y'
                    name='expiration_date'
                    value={values.expiration_date}
                    onChange={onChange}
                />
                <Form.Input
                    label='Price'
                    placeholder='New Price'
                    name='price'
                    value={values.price}
                    onChange={onChange}
                />
                <Form.Input
                    label='Shipment'
                    placeholder='New Shipment ID (S#...)'
                    name='shipment_batch'
                    value={values.shipment_batch}
                    onChange={onChange}
                />
                
            </Form>
            
            {(!isNull(errors)) && (
                <div className='ui error message'>
                    <h3> Edit Formatting Error </h3>
                    <p>{errors}</p>
                </div>
            )}
        </div>
        </Modal.Description>
      </Modal.Content>

      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>Close Without Submitting Changes</Button>
        <Button type='submit' primary
                onClick= {() => {
                  const errors = editFormatting()
                  setErrors(errors)
                  }}>
                    Submit Changes
                </Button>
      </Modal.Actions>
     
    </Modal>
  )
}

export default ProductInfoModal
