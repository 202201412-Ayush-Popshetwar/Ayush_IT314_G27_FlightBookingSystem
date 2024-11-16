import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import Navbar from './Navbar';
import Header from './Header';
import Footer from './Footer';

function Login({ loggedInUser , setLoggedInUser  }) {
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
                localStorage.setItem('loggedInUser ', name);
                localStorage.setItem('userId', userId);
                setLoggedInUser (name);
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
        <div className="flex flex-col min-h-screen" style={{ backgroundImage: "url('/flight.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <Navbar loggedInUser ={loggedInUser } setLoggedInUser ={setLoggedInUser } />
            <Header type="list" />

            <div className="flex-grow flex items-center justify-center py-20"> {/* Added padding for spacing */}
                <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-11/12 max-w-md">
                    <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label htmlFor='email' className="block text-gray-700 font-semibold mb-1">Email</label>
                            <input
                                onChange={handleChange}
                                type='email'
                                name='email'
                                placeholder='Enter your email...'
                                value={loginInfo.email}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor='password' className="block text-gray-700 font-semibold mb-1">Password</label>
                            <input
                                onChange={handleChange}
                                type='password'
                                name='password'
                                placeholder='Enter your password...'
                                value={loginInfo.password}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <button type='submit' className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-300">
                            Login
                        </button>
                        <span className="block text-center mt-4 text-gray-600">
                            Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Signup</Link>
                        </span>
                    </form>
                </div>
            </div>

            <Footer />
            <ToastContainer />
        </div>
    );
}

export default Login;