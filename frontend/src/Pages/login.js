import React, {useState} from 'react'
import {Form, Button} from 'semantic-ui-react'
import {useForm} from "../Utils/hooks";
import axios from 'axios'




function Login() {

    const login_url_string = "http://localhost:5000/login";
    const [errors, setErrors] = useState({})

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
                    window.location.replace("http://localhost:3000/dashboard");
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
                    Login!
                </Button>
            </Form>
            <Button onClick={e => switchPage()}>Register</Button>
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

export default Login