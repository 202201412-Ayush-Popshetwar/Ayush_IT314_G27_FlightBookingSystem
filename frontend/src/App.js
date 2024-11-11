
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/login";
import Home from "./components/home";
import Signup from "./components/signup";
import Checkout from "./components/checkoutPage";
import { useState, useEffect } from "react";
import RefrshHandler from "./RefreshHandler";
import Footer from './components/footer.jsx'

function App() {
  // Initially, check if the user is authenticated by looking at localStorage
  console.log("k");
  const [isAuthenticated, setAuthenticated] = useState(false);

  // On component mount, check for authentication token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthenticated(true);
    }
  }, []);

  // PrivateRoute returns either the element or redirects to /login
  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <div>
    <div className="App">
      
      <RefrshHandler setAuthenticated={setAuthenticated}/>
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} /> {/* Pass setAuthenticated */}
      <Route path="/home" element={<PrivateRoute element={<Home />} />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/checkout" element={<Checkout setAuthenticated={setAuthenticated} />} />
    </Routes>
    </div>
    <Footer/>
    </div>
      
  );
}

export default App;



