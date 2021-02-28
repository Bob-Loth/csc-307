import React, {useState} from 'react'

import { Button, Header, Modal } from 'semantic-ui-react'

function ProductInfoModal(props){
  const [open, setOpen] = useState(false);
  // gives message if no changes are made, or formatting isn't correct.
  // returns errors if anything went wrong.
  const editFormatting = (item) => {
    let price = parseFloat(item.price, 10)
    // round price to 2 decimal places, return errors if not a positive number
    if (isNaN(price)){
      return {errors: "Price must be a number"}
    }
    else if (price < 0){
      return {errors: "Price must be a positive number"}
    }
    else{
      price = price.toFixed(2)
    }
    // sku's first 4 characters must be SKU#, and the following
    // number must be 8 digits long, exactly
    const regexSku = new RegExp('^SKU#\\d{8}$');
    if (!regexSku.test(item.sku)){//if not an 8 digit number
      return {errors: "SKU code number must be 8 digits and start with 'SKU#'"}
    }
    // Shipment must be in format "S#digits, from 1 up to 8 digits"
    const regexShipment = new RegExp('^S#[0-9]{1,8}$')
    if (!regexShipment.test(item.shipment_batch)){
      return {errors: "Shipment must be of the form S#N, " + 
                      "where N is a 1-8 digit number"}
    }
    // a date, of the format m-d-y. m and d can be either 1-2 digits. 
    // y must be 4 digits, and between 1900 and 2199.
    const regexDate = new RegExp('^((1[0-2]|[1-9])-(3[01]|[12][0-9]|[1-9])' + 
    '-(19[0-9]{2}|2[0-1][0-9]{2}))|(N/A)$') // <- this part is the -y, above are m-d
    if (!regexDate.test(item.expiration_date)){
      return {errors: "Date must be of the format m-d-y.\n" +
                      "Valid month: 1-12\n" +
                      "Valid day: 1-31\n" +
                      "Valid year: 1900-2199\n" +
                      "Optionally, 'N/A' should be used for items with no" + 
                      "expiration date."}
    }
    return {errors: null, price: price}
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
          <Header>Name: {props.name}</Header>
          <p>Expiration date: {props.expiration_date}</p>
          <p>SKU: {props.sku}</p>
          <p>Category: {props.category}</p>
          <p>Price: ${props.price}</p>
          <p>Shipment Batch: {props.shipment_batch}</p>
          <p>{editFormatting(props).price}</p>
        </Modal.Description>
      </Modal.Content>

      <Modal.Actions>
        <Button
        onClick={() => setOpen(false)}>
          Exit Without Changes
        </Button>
        <Button
        onClick={() => setOpen(false)}> 
          Confirm Changes and Exit
        </Button>
      </Modal.Actions>
     
    </Modal>
  )
}

export default ProductInfoModal
