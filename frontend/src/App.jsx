import Home from "./components/Home";
import List from "./components/List";
import Flight from "./components/Flight";
import Login from "./components/login.jsx";
import Signup from "./components/signup.jsx";
import Profile from "./components/profile.jsx";
import { useState, useEffect } from "react";
import RefrshHandler from "./RefreshHandler.jsx";
import FAQ from "./components/FAQ.jsx";
import Booking from "./components/booking.jsx";
import Payment from "./components/payment.jsx";
import Confirmation from "./components/Confirmation.jsx";
<com></com>
import {
  Navigate,
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import React from "react";
import { Last } from "react-bootstrap/esm/PageItem.js";



function App() {
  const [loggedInUser, setLoggedInUser] = useState('');
  
  
  return (
    <BrowserRouter>
      <RefrshHandler setLoggedInUser ={setLoggedInUser} />
      <Routes>
        <Route path="/" element={<Home loggedInUser={loggedInUser}/>} />
        <Route path="/flights" element={<List />} />
        <Route path="/flights/:id" element={<Flight />} />
        <Route path="/login" element={<Login loggedInUser={loggedInUser} />} /> 
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile loggedInUser={loggedInUser}/> }/>
        <Route path='/faq' element={<FAQ loggedInUser={loggedInUser}  />} />
        <Route path='booking' element={<Booking loggedInUser={loggedInUser}/>} />
        <Route path='/payment' element={<Payment loggedInUser={loggedInUser}/>}/>
        <Route path='/confirmation' element={<Confirmation loggedInUser={loggedInUser}/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
