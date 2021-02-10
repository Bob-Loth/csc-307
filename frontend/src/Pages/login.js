import React, {useState} from 'react'
import {Form, Button} from 'semantic-ui-react'
import {useForm} from "../Utils/hooks";

function Login() {

    const [errors, setErrors] = useState({})

    const initialState = {
        username: '',
        password: '',
    }


    const {onChange, onSubmit, values} = useForm(loginUserCallback, initialState)

    function loginUserCallback() {
        console.log('hello')
    }

    return (
        <div className='form-container'>
            <Form onSubmit={onSubmit} noValidate className=''>
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