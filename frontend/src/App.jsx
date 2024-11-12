import Home from "./components/Home";
import List from "./components/List";
import Flight from "./components/Flight";
import Login from "./components/login.jsx";
import Signup from "./components/signup.jsx";
import { useState, useEffect } from "react";
import RefrshHandler from "./RefreshHandler.jsx";
import {
  Navigate,
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import React from "react";



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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
