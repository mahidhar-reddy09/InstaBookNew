import React, { useContext, useState } from 'react';
import './login.scss';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

const Login = () => {
    const [inputs, setInputs] = useState({
        username: '',
        password: ''
    });

    const [err, setErr] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(inputs);
            navigate('/');
        } catch (err) {
            if (err.response && err.response.data) {
                setErr(err.response.data.message || JSON.stringify(err.response.data));
            } else {
                setErr('An error occurred');
            }
        }
    };

    return (
        <div className='login'>
            <div className="card">
                <div className="left">
                    <h1>Hello Everyone!</h1>
                    <p>
                        Just a student trying out some projects! Welcome to my website feel free to test it out!
                    </p>
                    <span>Don't you have an account?</span>
                    <Link to='/register'>
                        <button>Register</button>
                    </Link>
                </div>
                <div className="right">
                    <h1>Login</h1>
                    <form onSubmit={handleLogin}>
                        <input
                            type="text"
                            placeholder='Username'
                            name='username'
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            placeholder='Password'
                            name='password'
                            onChange={handleChange}
                        />
                        {err && <span className="error">{err}</span>}
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
