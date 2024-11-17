import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import Navbar from './Navbar';
import Header from './Header';
import Footer from './Footer';

function Signup({ loggedInUser , setLoggedInUser  }) {
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo({ ...signupInfo, [name]: value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(prevState => !prevState);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password, confirmPassword } = signupInfo;
        
        if (!name || !email || !password || !confirmPassword) {
            return handleError('All fields are required');
        }

        if (password !== confirmPassword) {
            return handleError('Passwords do not match');
        }

        try {
            const url = `http://localhost:5050/auth/signup`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });
            const result = await response.json();
            const { success, message, error } = result;

            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else {
                handleError(message);
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    return (
        <div className="flex flex-col min-h-screen" style={{ backgroundImage: "url('/flight.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <Navbar loggedInUser ={loggedInUser } setLoggedInUser ={setLoggedInUser } />
            <Header type="list" />

            <div className="flex-grow flex items-center justify-center py-20"> {/* Added padding for spacing */}
                <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-11/12 max-w-md">
                    <h1 className="text-2xl font-semibold text-center mb-6">Signup</h1>
                    <form onSubmit={handleSignup}>
                        <div className="mb-4">
                            <label htmlFor='name' className="block text-gray-700 font-semibold mb-1">Name</label>
                            <input
                                onChange={handleChange}
                                type='text'
                                name='name'
                                autoFocus
                                placeholder='Enter your name...'
                                value={signupInfo.name}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor='email' className="block text-gray-700 font-semibold mb-1">Email</label>
                            <input
                                onChange={handleChange}
                                type='email'
                                name='email'
                                placeholder='Enter your email...'
                                value={signupInfo.email}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="mb-4" style={{ position: 'relative' }}>
                            <label htmlFor='password' className="block text-gray-700 font-semibold mb-1">Password</label>
                            <input
                                onChange={handleChange}
                                type={showPassword ? 'text' : 'password'}
                                name='password'
                                placeholder='Enter your password...'
                                value={signupInfo.password}
                                className=" w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="mb-4" style={{ position: 'relative' }}>
                            <label htmlFor='confirmPassword' className="block text-gray-700 font-semibold mb-1">Confirm Password</label>
                            <input
                                onChange={handleChange}
                                type={showConfirmPassword ? 'text' : 'password'}
                                name='confirmPassword'
                                placeholder='Confirm your password...'
                                value={signupInfo.confirmPassword}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <button type='submit' className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-300">
                            Signup
                        </button>
                        <span className="block text-center mt-4 text-gray-600">
                            Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
                        </span>
                    </form>
                </div>
            </div>

            <Footer />
            <ToastContainer />
        </div>
    );
}

export default Signup;