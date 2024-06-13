import React, { useState } from 'react';
import './register.scss'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {

    const navigate = useNavigate();

    // To get inputs from user
    const [inputs, setInputs] = useState({
        username: '',
        email: '',
        password: '',
        name: '',
    })

    const [err, setErr] = useState(null)

    // Get the input values
    const handleChange = (e) => {
        setInputs((prev) => ({...prev, [e.target.name]: e.target.value}))
    }

    const handleClick = async e =>{
        e.preventDefault()

        // Using axios to do a post req
        try{
            await axios.post("http://localhost:8800/api/auth/register", inputs)
            alert("Successfully registered User!")
            navigate('/login')
        }catch(err){
            setErr(err.response.data)
        }
    }
 
    console.log(err)



    return (
        <div className='register'>
            <div className="card">

                <div className="left">
                    <h1>Insta Book!</h1>
                    <p>
                    Go head and register a account and lets get to it!
                    </p>
                    <span>Do you have an account?</span>
                    <Link to='/login'>
                        <button>Login</button>
                    </Link>
                </div>

                <div className="right">
                    <h1>Register!</h1>
                    <form>
                        <input type = "text" placeholder='Name' name="name" onChange={handleChange}></input>
                        <input type = "text" placeholder='Username' name="username" onChange={handleChange}></input>
                        <input type = "email" placeholder='Email' name="email" onChange={handleChange}></input>
                        <input type = "password" placeholder='Password' name="password" onChange={handleChange}></input>
                        {err && err}
                        <button onClick={handleClick}>register</button>
                    </form>
                    
                </div>
            </div>
        </div>
    )
}

export default Register