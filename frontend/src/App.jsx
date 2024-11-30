import Home from "./components/Home";
import List from "./components/List";
import Login from "./components/login.jsx";
import Signup from "./components/signup.jsx";
import Profile from "./components/profile.jsx";
import { useState, useEffect } from "react";
import RefrshHandler from "./RefreshHandler.jsx";
import FAQ from "./components/FAQ.jsx";
import Booking from "./components/booking.jsx";
import Payment from "./components/payment.jsx";
import Confirmation from "./components/Confirmation.jsx";
import Addon from "./components/Addon.jsx";
import Aboutus from "./components/Aboutus.jsx";
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
      <RefrshHandler loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
      <Routes>
        <Route path="/" element={<Home loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>} />
        <Route path="/flights" element={<List loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>} />
        <Route path="/login" element={<Login loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>} /> 
        <Route path="/signup" element={<Signup loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>} />
        <Route path="/profile" element={<Profile loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/> }/>
        <Route path='/faq' element={<FAQ loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />} />
        <Route path='/booking' element={<Booking loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>} />
        <Route path='/payment' element={<Payment loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>}/>
        <Route path='/confirmation' element={<Confirmation loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>}/>
        <Route path='/Addon' element={<Addon loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>}/>
        <Route path='/Aboutus' element={<Aboutus loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
