import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

const Navbar = ({ setAuthenticated, loggedInUser, setLoggedInUser }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const handleLogout = () => {
        handleSuccess('User Logged out');
        setTimeout(() => {
            setAuthenticated(false);
            localStorage.removeItem('token');
            localStorage.removeItem('loggedInUser');
            setLoggedInUser('');
            navigate('/login');
        }, 1000);
    };

    return (
        <div className="navbar">
            <div className="navContainer">
                <div className="logoContainer">
                    <img src="/img/logo/SkyLynx_icon.jpg" alt="SkyLynx" className="logo" />
                    <h2 className="logoText">SkyLynx</h2>
                </div>
                <div className="navButtons">
                    {loggedInUser ? (
                        <div className="dropdown">
                            <button className="navButton" onClick={toggleDropdown}>
                                {loggedInUser} ▼
                            </button>
                            {dropdownOpen && (
                                <div className="dropdownMenu">
                                    <button 
                                        className="dropdownItem" 
                                        onClick={() => navigate("/profile")}
                                    >
                                        User Profile
                                    </button>
                                    <button 
                                        className="dropdownItem" 
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="dropdown">
                            <button className="navButton" onClick={toggleDropdown}>
                                Login/Register ▼
                            </button>
                            {dropdownOpen && (
                                <div className="dropdownMenu">
                                    <button 
                                        className="dropdownItem" 
                                        onClick={() => navigate("/login")}
                                    >
                                        Login
                                    </button>
                                    <button 
                                        className="dropdownItem" 
                                        onClick={() => navigate("/signup")}
                                    >
                                        Register
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Navbar;
