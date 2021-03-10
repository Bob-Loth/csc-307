import React, {useEffect, useState} from 'react'
import { Grid} from 'semantic-ui-react'
import axios from 'axios'
import ListView from "../Components/ListView";

function Dashboard() {

    const expiry_url_string = "http://localhost:5000/dashboard/expiry";
    const lowstock_url_string = "http://localhost:5000/dashboard/lowstock";

    const [expired_products, set_expired_products] = useState([])
    const [lowstock_products, set_lowstock_products] = useState([])

    useEffect(() => {
        axios.get(expiry_url_string)
            .then(res => {
                set_expired_products(res)
        })
    }, []);

    useEffect(() => {
        axios.get(lowstock_url_string)
            .then(res => {
                set_lowstock_products(res)
            })
    }, []);

    return (
        <div className='form-container'>
            <h1>Dashboard </h1>
            <Grid columns={2} padded>
                <Grid.Column>
                    <ListView listName='Expiry' secondHeaderField='Expiration Date'
                              products={expired_products}/>
                </Grid.Column>
                <Grid.Column>
                    <ListView listName='Low Stock' secondHeaderField='Stock Count'
                              products={lowstock_products}/>
                </Grid.Column>
            </Grid>

        </div>
    )

}

export default Dashboard
