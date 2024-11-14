import { set } from 'date-fns';
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function RefrshHandler({ setLoggedInUser }) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            const user = localStorage.getItem('loggedInUser');
            setLoggedInUser(prevUser => {
                if (prevUser !== user) {
                    return user;
                }
                return prevUser;
            });
            if (location.pathname === '/' ||
                location.pathname === '/login' ||
                location.pathname === '/signup'
            ) {
                navigate('/', { replace: false });
            }
        }
    }, [location, navigate, setLoggedInUser]);

    return (
        null
    )
}

export default RefrshHandler