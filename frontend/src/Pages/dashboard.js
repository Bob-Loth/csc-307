import React from 'react'
import {Button} from 'semantic-ui-react'
import {useForm} from "../Utils/hooks";
import axios from 'axios'

function Dashboard() {

    const login_url_string = "http://localhost:5000/home";
    //const [errors, setErrors] = useState({})

    const initialState = {
        username: '',
        password: '',
    }
    
    const {values} = useForm(loginUserCallback, initialState)

    function switchPage() {
        console.log("hello");
        window.location.replace("http://localhost:3000");

    }

    function loginUserCallback() {
        //once login button is clicked, send the fields to the backend and do
        //something with the response
        axios.post(login_url_string, {'name': values.username, 'pwd': values.password})
            .then((resp) => console.log(resp));
    }

    return (
        <div className='form-container'>
            <h1>Dashboard </h1>
            <Button onClick={() => switchPage()}>Back to Login</Button>
        </div>
    )

}

export default Dashboard