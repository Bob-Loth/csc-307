import React, {useState} from 'react'
import {useForm} from '../Utils/hooks'
import axios from 'axios'
import { Button, Modal, Form } from 'semantic-ui-react'

function ProductInfoModal(props){
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState("");
  const search_url_string = "http://localhost:5000/search"
  const initialState = {
    _id: props._id,
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
    let errorString = "";
    let price = parseFloat(values.price, 10)
    // round price to 2 decimal places, return errors if not a positive number
    if (isNaN(price)){
      errorString = errorString.concat("Price must be a number.\n")
    }
    else if (price < 0){
      errorString = errorString.concat("Price must be a positive number.\n")
    }
    else{
      price = price.toFixed(2)
    }
    // sku's first 4 characters must be SKU#, and the following
    // number must be 8 digits long, exactly
    const regexSku = new RegExp('^SKU#\\d{8}$');
    if (!regexSku.test(values.sku)){//if not an 8 digit number
      errorString = errorString.concat("SKU code number must be 8 digits and start with 'SKU#'\n")
    }
    // Shipment must be in format "S#digits, from 1 up to 8 digits"
    const regexShipment = new RegExp('^S#[0-9]{1,8}$')
    if (!regexShipment.test(values.shipment_batch)){
      errorString = errorString.concat("Shipment must be of the form S#N, " + 
                      "where N is a 1-8 digit number\n")
    }
    // a date, of the format m-d-y. m and d can be either 1-2 digits.
    //m must be 1-12. d must be 1-31. 
    // y must be 4 digits, and between 1900 and 2199.
    const regexDate = new RegExp('^((1[0-2]|[1-9])-(3[01]|[12][0-9]|[1-9])' + 
    '-(19[0-9]{2}|2[0-1][0-9]{2}))|(N/A)$') // <- this part is the -y, above are m-d
    if (!regexDate.test(values.expiration_date)){
      errorString = errorString.concat("Date must be of the format m-d-y.\n" +
                      "Valid month: 1-12\n" + 
                      "Valid day: 1-31\n" +
                      "Valid year: 1900-2199\n" +
                      "Optionally, 'N/A' should be used for items with no\n" + 
                      "expiration date.")
    }
    return errorString;
  }
  //makes sure only the modified fields will be sent.
  function buildPatchObj() {
    let ret = {};
    if (props.name !== values.name) ret.name = values.name;
    if (props.sku !== values.sku) ret.sku = values.sku;
    if (props.category !== values.category) ret.category = values.category;
    if (props.expiration_date !== values.expiration_date) ret.expiration_date = values.expiration_date;
    if (props.price !== values.price) ret.price = values.price;
    if (props.shipment_batch !== values.shipment_batch) ret.shipment_batch = values.shipment_batch;
    
    return ret
  }

  function editProductCallback(patchObj) {
    
    /*if there was any data edited*/
    if (Object.keys(patchObj).length !== 0){
      axios.patch(search_url_string + "?_id=" + values._id.toString(), patchObj)
        .then( (resp) => {
            console.log(resp.data)
        })
        .catch(err => {
            if (err.response) {
                console.log(err.response.data)
            }
        });
    }
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
                    placeholder='New Expiration Date (m-d-y)'
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
            
            {(errors !== "") && (
                <div className='ui error message'>
                    <h3> Edit Formatting Error </h3>
                    <div>{errors.split("\n").map((i,key) => {
                                      return <div key={key}>{i}</div>;
        })}</div>
                </div>
            )}
        </div>
        </Modal.Description>
      </Modal.Content>

      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>Close Without Submitting Changes</Button>
        <Button type='submit' primary loading={false}
                onClick= {() => {
                  let errors = editFormatting()
                  const patchObj = buildPatchObj();
                  if (Object.keys(patchObj).length === 0){
                    errors = errors.concat("Must modify at least one field\n")
                  }
                  setErrors(errors)
                  if (errors === ""){
                    console.log(errors)
                    editProductCallback(patchObj)
                  }
                  else{
                    console.log(errors)
                  }
                }}>
                  Submit Changes
                </Button>
      </Modal.Actions>
     
    </Modal>
  )
}

export default ProductInfoModal
