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
  const [isAuthenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthenticated(true);
     
    }
    
  }, []);
  

  return (
    <BrowserRouter>
      <RefrshHandler setAuthenticated={setAuthenticated} />
      <Routes>
        <Route path="/" element={<Home  isAuthenticated={isAuthenticated} setAuthenticated={setAuthenticated}/>} />
        <Route path="/flights" element={<List />} />
        <Route path="/flights/:id" element={<Flight />} />
        <Route path="/login" element={<Login isAuthenticated={isAuthenticated} setAuthenticated={setAuthenticated} />} /> {/* Pass setAuthenticated */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile/>}/>
        <Route path='/faq' element={<FAQ isAuthenticated={isAuthenticated}  />} />
        <Route path='booking' element={<Booking/>} />
        <Route path='/payment' element={<Payment/>}/>
        <Route path='/confirmation' element={<Confirmation/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
