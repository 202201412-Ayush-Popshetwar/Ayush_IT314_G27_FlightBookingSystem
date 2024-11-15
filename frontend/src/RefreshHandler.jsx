import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function RefrshHandler({ setLoggedInUser }) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('loggedInUser');

        if (token) {
            // Update logged-in user state only if needed
            setLoggedInUser(prevUser => (prevUser !== user ? user : prevUser));
            if (
                location.pathname === '/' ||
                location.pathname === '/login' ||
                location.pathname === '/signup'
            ) {
                navigate('/', { replace: true }); // Use replace:true to avoid history clutter
            }
        }
    }, [location.pathname, navigate]); // Only run when the path changes

    return null;
}

export default RefrshHandler;
