import React, {useEffect} from 'react'
import { Grid} from 'semantic-ui-react'
import axios from 'axios'
import ListView from "../Components/ListView";

function Dashboard() {

    const dash_url_string = "http://localhost:5000/dashboard";

    const token = localStorage.getItem('jwtToken')


    useEffect(() => {
        axios.get(dash_url_string, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            console.log(res)
        })
    }, [])

    return (
        <div className='form-container'>
            <h1>Dashboard </h1>
            <Grid columns={2} padded>
                <Grid.Column>
                    <ListView listName='Expiry' secondHeaderField='Expiration Date'
                              products={{pName: 'Apples', additionalField: '03/03/2021'}}/>
                </Grid.Column>
                <Grid.Column>
                    <ListView listName='Low Stock' secondHeaderField='Stock Count'
                              products={{pName: 'Apples', additionalField: '30'}}/>
                </Grid.Column>
            </Grid>

        </div>
    )

}

export default Dashboard
