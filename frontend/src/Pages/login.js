/* eslint-disable no-unused-vars */
import React, {useState} from 'react'
import {Form, Button} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import {useForm} from "../Utils/hooks";
import axios from 'axios'




function Login() {

    const login_url_string = "http://localhost:5000/login";
    const [errors, setErrors] = useState({
        username : [],
        password : []
    })
    const [success, setSuccess] = useState(null)

    const initialState = {
        username: '',
        password: '',
    }

    const {onChange, onSubmit, values} = useForm(loginUserCallback, initialState)

    function switchPage() {
        console.log("hello");
        window.location.replace("http://localhost:3000/register");
        
    }

    function loginUserCallback() {       
        //once login button is clicked, send the fields to the backend and do
        //something with the response
        axios.post(login_url_string,{'name': values.username, 'pwd': values.password})
          .then( (resp) => {
                if (resp.data.success){
                    setSuccess(true)
                    window.location.replace("http://localhost:3000/dashboard");
                }
                if(!resp.data.success) {
                    console.log(resp.data)
                    setSuccess(false)
                    setErrors(resp.data.errors)
                }
            });
    }

    return (
        <div className='form-container'>
            <Form onSubmit={loginUserCallback} noValidate className=''>
                <h1> Login </h1>
                <Form.Input
                    label='Username'
                    placeholder='Username...'
                    name='username'
                    value={values.username}
                    onChange={onChange}
                />
                <Form.Input
                    label='Password'
                    placeholder='Password...'
                    name='password'
                    type='password'
                    value={values.password}
                    onChange={onChange}
                />
                <Button type='submit' primary>
                    Login!
                </Button>
            </Form>
            <Button onClick={() => switchPage()}>Register</Button>
            {
                (success === false && (
                    <div className='ui error message'>
                        <h1> Login Failed! </h1>
                    </div>
                ))
            }
            {(errors.username.length > 0 )  && (
                <div className='ui error message'>
                    <h3> Username Input Error </h3>
                    <ul className='list'>
                        {Object.values(errors.username).map((value => (
                            <li key={value}>{value}</li>
                        )))}
                    </ul>
                </div>
            )}
            {(errors.password.length > 0 )  && (
                <div className='ui error message'>
                    <h3> Password Input Error </h3>
                    <ul className='list'>
                        {Object.values(errors.password).map((value => (
                            <li key={value}>{value}</li>
                        )))}
                    </ul>
                </div>
            )}
        </div>
    )

}

export default Login