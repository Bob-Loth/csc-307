import React, {useEffect} from 'react'
import {Button} from 'semantic-ui-react'
import axios from 'axios'

function Dashboard() {

    const dash_url_string = "http://localhost:5000/dashboard";

    const token = localStorage.getItem('jwtToken')

    function switchPage() {
        window.location.replace("http://localhost:3000");
    }

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
            <Button onClick={() => switchPage()}>Back to Login</Button>
        </div>
    )

}

export default Dashboard