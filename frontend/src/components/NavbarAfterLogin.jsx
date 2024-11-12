import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

const Navbar = ({setAuthenticated}) => {
    const navigate = useNavigate();  // Hook for navigation

    return (
        <div className="navbar">
            <div className="navContainer">
                <div className="logoContainer">
                    <img src="/img/logo/SkyLynx_icon.jpg" alt="SkyLynx" className="logo" />
                    <h2 className="logoText">SkyLynx</h2>
                </div>
                <div className="navButtons">
                    <button 
                        className="navButton" 
                        onClick={() => navigate("/signup")}
                    >
                        User Profile
                    </button>
                    <button 
                        className="navButton" 
                        onClick={() =>{
                            
                            handleSuccess('User Logged out');
                            setTimeout(() => {
                                setAuthenticated(false)
                                localStorage.removeItem('token');
                                localStorage.removeItem('loggedInUser');
                                setLoggedInUser('');
                                navigate('/login');
                            }, 1000);
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
            <ToastContainer/>
        </div>
    );
}

export default Navbar;
