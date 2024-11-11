

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import { Button, Card } from 'react-bootstrap';
import Header from './header_for_home';
const Home = () => {
  const [loggedInUser, setLoggedInUser] = useState('');
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query
  const navigate = useNavigate();

  // Set logged-in user from localStorage
  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User Logged out');
    setLoggedInUser('');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const handleCheckout = () => {
    const cartItems = products
      .map((product) => {
        const quantity = localStorage.getItem(`quantity-${product.productId}`);
        return {
          productId: product.productId,
          name: product.name,
          quantity: parseInt(quantity, 10) || 0,
          price: product.price,
        };
      })
      .filter((item) => item.quantity > 0); // Keep only non-zero quantities

    if (cartItems.length === 0) {
      handleError('No items in the cart');
      return;
    }
    navigate('/checkout', { state: { cartItems } });
  };

  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      const url = 'http://localhost:8090/products';
      const headers = {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      };
      const response = await fetch(url, headers);
      const result = await response.json();
      setProducts(result);
      console.log(typeof(result));
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Header loggedInUser={loggedInUser} handleLogout={handleLogout} />

     
      

      {/* Search Input */}
      <div>
        <input
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
        />
      </div>

      {/* Display Products */}
      <div className="products-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <FoodItemCard
              key={product.productId}
              name={product.name}
              description={product.description}
              price={product.price}
              productId={product.productId} // Pass the product ID to persist quantities
            />
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
      <Button onClick={handleCheckout}>Go to Checkout</Button>
      <ToastContainer />
    </div>
  );
};

// FoodItemCard component with quantity control and persistence
const FoodItemCard = ({ name, description, price, productId }) => {
  const [quantity, setQuantity] = useState(0);

  // Load the quantity from localStorage when the component mounts
  useEffect(() => {
    const storedQuantity = localStorage.getItem(`quantity-${productId}`);
    if (storedQuantity) {
      setQuantity(parseInt(storedQuantity, 10));
    }
  }, [productId]);

  // Update the quantity and save it to localStorage
  const increaseQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    localStorage.setItem(`quantity-${productId}`, newQuantity);
  };

  const decreaseQuantity = () => {
    const newQuantity = Math.max(0, quantity - 1);
    setQuantity(newQuantity);
    localStorage.setItem(`quantity-${productId}`, newQuantity);
  };

  return (
    <div className="food-card">
      {/* <img src={imageUrl} alt={name} className="food-image" /> */}
      <div className="food-info">
        <h2 className="food-title">{name}</h2>
        <p className="food-description">{description}</p>
        <p className="food-price">price {price}</p>
      </div>
      <div className="quantity-control">
        <button onClick={decreaseQuantity} className="quantity-button">
          -
        </button>
        <span className="quantity-display">{quantity}</span>
        <button onClick={increaseQuantity} className="quantity-button">
          +
        </button>
      </div>
    </div>
  );
};

export default Home;


