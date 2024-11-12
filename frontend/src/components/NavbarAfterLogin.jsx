import React, { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

const Navbar = ({ setAuthenticated }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const [loggedInUser,setLoggedInUser] = useState('');
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const handleLogout = () => {
        handleSuccess('User Logged out');
        setTimeout(() => {
            setAuthenticated(false);
            localStorage.removeItem('token');
            localStorage.removeItem('loggedInUser');
            navigate('/login');
        }, 1000);
    };

    useEffect(() => {
        const user = localStorage.getItem('loggedInUser');
        if (user) {
          setLoggedInUser(user);
    }
    },[]);
    return (
        <div className="navbar">
            <div className="navContainer">
                <div className="logoContainer">
                    <img src="/img/logo/SkyLynx_icon.jpg" alt="SkyLynx" className="logo" />
                    <h2 className="logoText">SkyLynx</h2>
                </div>
                <div className="navButtons">
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
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Navbar;
