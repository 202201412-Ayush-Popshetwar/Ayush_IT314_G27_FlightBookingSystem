import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

const Navbar = ({ loggedInUser,setLoggedInUser}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const handleLogout = () => {
        handleSuccess('User Logged out');
        setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('loggedInUser');
            localStorage.removeItem('userId');
            setLoggedInUser('');
            navigate('/');
        }, 1000);
    };

    return (
        <div className="navbar">
            <div className="navContainer">
                <div className="logoContainer" onClick={() => {navigate("/")}}>
                    <img src="/img/logo/SkyLynx_icon.jpg" alt="SkyLynx" className="logo"/>
                    <h2 className="logoText">SkyLynx</h2>
                </div>
                <div className="navButtons">
                    {loggedInUser ? (
                        <div className="dropdown">
                            <button className="navButton" onClick={toggleDropdown}>
                                Hello, {loggedInUser} ▼
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
