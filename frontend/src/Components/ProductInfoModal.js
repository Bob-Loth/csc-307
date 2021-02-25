import React, {useState} from 'react'

import { Button, Header, Modal } from 'semantic-ui-react'

function ProductInfoModal(props){
  const [open, setOpen] = useState(false);
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
