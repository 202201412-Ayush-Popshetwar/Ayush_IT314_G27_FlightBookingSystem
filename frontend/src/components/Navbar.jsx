import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

const Navbar = ({ loggedInUser , setLoggedInUser  }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const handleLogout = () => {
        handleSuccess('User  Logged out');
        setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('loggedInUser ');
            localStorage.removeItem('userId');
            setLoggedInUser ('');
            navigate('/');
        }, 1000);
    };

    return (
        <div className="bg-[#003580] sticky top-0 z-50 shadow-md">
            <div className="flex justify-between items-center p-2 max-w-screen-xl mx-auto">
                <div className="flex items-center cursor-pointer" onClick={() => { navigate("/") }}>
                    <img src="/img/logo/SkyLynx_icon.jpg" alt="SkyLynx" className="w-[10vw] h-[10vw] md:w-[8vh] md:h-[8vh] mr-3 rounded" />
                    <h2 className="text-[3vw] md:text-3xl font-bold text-white">SkyLynx</h2>
                </div>
                <div className="flex items-center relative">
                    {loggedInUser  ? (
                        <div className="relative">
                            <button 
                                className="text-white px-4 py-2 rounded-md bg-gradient-to-r from-[#3b82f6] to-[#4a90e2] hover:opacity-90 transition duration-300" 
                                onClick={toggleDropdown}
                            >
                                Hello, {loggedInUser } ▼
                            </button>
                            {dropdownOpen && (
                                <div className="w-full absolute mt-2 bg-[#0071c2] rounded-lg shadow-lg z-10 flex flex-col items-center">
                                    <button 
                                        className="block px-4 py-2 text-center w-full text-white bg-gradient-to-r from-[#3b82f6] to-[#4a90e2] hover:opacity-90 transition duration-300 rounded-t-lg" 
                                        onClick={() => navigate("/profile")}
                                    >
                                        User Profile
                                    </button>
                                    <button 
                                        className="block px-4 py-2 text-center w-full text-white bg-gradient-to-r from-[#3b82f6] to-[#4a90e2] hover:opacity-90 transition duration-300 rounded-b-lg" 
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex space-x-4">
                            <button 
                                className="text-white px-4 py-2 rounded-md bg-gradient-to-r from-[#3b82f6] to-[#4a90e2] hover:opacity-90 transition duration-300" 
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </button>
                            <button 
                                className="text-white px-4 py-2 rounded-md bg-gradient-to-r from-[#3b82f6] to-[#4a90e2] hover:opacity-90 transition duration-300" 
                                onClick={() => navigate("/signup")}
                            >
                                Register
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Navbar;