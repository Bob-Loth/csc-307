import React, {useState} from 'react'
import {Form, Button} from 'semantic-ui-react'
import {useForm} from "../Utils/hooks";
import axios from 'axios'


function Register(){

    const register_url_string = "http://localhost:5000/register";
    // eslint-disable-next-line no-unused-vars
    const [errors, setErrors] = useState({})

    const initialState = {
        username: '',
        password: '',
    }

    const {onChange, values} = useForm(registerUserCallback, initialState)

    function switchPage() {
        console.log("hello");
        window.location.replace("http://localhost:3000/");
        
    }

    function registerUserCallback() {       
        //once login button is clicked, send the fields to the backend and do
        //something with the response
        axios.post(register_url_string,{'name': values.username, 'pwd': values.password})
          .then( (resp) => console.log(resp));
    }

    return (
        <div className='form-container'>
            <Form onSubmit={registerUserCallback} noValidate className=''>
                <h1> Register </h1>
                <Form.Input
                    label='Username'
                    placeholder='Username...'
                    name='username'
                    value={values.username}
                    error={!!errors.username}
                    onChange={onChange}
                />
                <Form.Input
                    label='Password'
                    placeholder='Password...'
                    name='password'
                    type='password'
                    value={values.password}
                    error={!!errors.password}
                    onChange={onChange}
                />
                <Button type='submit' primary>
                    Register
                </Button>
            </Form>
            <Button onClick={() => switchPage()}>Back to Login</Button>
            {Object.keys(errors).length > 0 && (
                <div className='ui error message'>
                    <ul className='list'>
                        {Object.values(errors).map((value => (
                            <li key={value}>{value}</li>
                        )))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default Register