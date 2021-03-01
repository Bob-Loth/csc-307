import React, { useState} from 'react'
import {Form, Button} from 'semantic-ui-react'
import {useForm} from "../Utils/hooks";
import axios from 'axios'


function Register(){

    const register_url_string = "http://localhost:5000/register";
    const [errors, setErrors] = useState({
        username: [],
        password: []
    })

    const [success, setSuccess] = useState(null)
    const initialState = {
        username: '',
        password: '',
    }
    const {onChange, values} = useForm(registerUserCallback, initialState)

    function switchPage() {
        window.location.replace("http://localhost:3000/");
    }

    function registerUserCallback() {       
        //once login button is clicked, send the fields to the backend and do
        //something with the response
        axios.post(register_url_string,{'name': values.username, 'pwd': values.password})
          .then( () => {
              setSuccess(true)
              switchPage()
          })
          .catch( (err) => {
              if (err.response){
                  setSuccess(false)
                  setErrors(err.response.data.errors)
              }
          });
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
                    Register
                </Button>
            </Form>
            <Button onClick={() => switchPage()}>Back to Login</Button>
            {
                (success === false && (
                    <div className='ui error message'>
                        <h1> Register Failed! </h1>
                    </div>
                ))
            }
            {(errors.username.length > 0) && (
                <div className='ui error message'>
                    <h3> Username Input Error </h3>
                    <ul className='list'>
                        {Object.values(errors.username).map((value => (
                            <li key={value}>{value}</li>
                        )))}
                    </ul>
                </div>
            )}
            {(errors.password.length > 0) && (
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

export default Register