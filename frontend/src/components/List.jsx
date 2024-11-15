import React from 'react';
import Navbar from './Navbar';
import Header from './Header';

const List = ({loggedInUser,setLoggedInUser}) => {
    return (
        <div>
            <Navbar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>
            <Header type="list"/>
        </div>
    )
}

export default List;