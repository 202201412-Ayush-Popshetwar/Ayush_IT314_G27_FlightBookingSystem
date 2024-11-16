import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import './index.css';
import Navbar from './Navbar';
import Header from './Header';
import { set } from 'date-fns';

function Login({ loggedInUser ,setLoggedInUser }) {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo({ ...loginInfo, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError('Email and password are required');
        }
        try {
            const url = `http://localhost:5050/auth/login`;
            const response = await fetch(url, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            console.log(result);  // Add this line to see the full response from the backend
    
            const { success, message, jwtToken, name, error, userId } = result;
            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                localStorage.setItem('userId', userId);
                setLoggedInUser(name);
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else if (error) {
                handleError(error?.details[0].message);
            } else {
                handleError(message);
            }
        } catch (err) {
            console.error(err);  // Log error details
            handleError(err.message);
        }
    };

    return (
        <div>
            <Navbar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>
            <Header type="list"/>
        <div className='login-background'>
            <div className='login-container'>
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <div>
                        <label htmlFor='email' className='login-label'>Email</label>
                        <input
                            onChange={handleChange}
                            type='email'
                            name='email'
                            placeholder='Enter your email...'
                            value={loginInfo.email}
                            className='login-input'
                        />
                    </div>
                    <div>
                        <label htmlFor='password' className='login-label'>Password</label>
                        <input
                            onChange={handleChange}
                            type='password'
                            name='password'
                            placeholder='Enter your password...'
                            value={loginInfo.password}
                            className='login-input'
                        />
                    </div>
                    <button type='submit' className='login-button'>Login</button>
                    <span>Don't have an account? <Link to="/signup">Signup</Link></span>
                </form>
            </div>
            <ToastContainer />
        </div>
        </div>
    );
}

export default Login;
