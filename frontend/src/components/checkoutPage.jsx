import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Checkout = () => {
  const location = useLocation();
  const [cartItems, setCartItems] = useState(location.state?.cartItems || []);
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);

  // Calculate total price when cartItems changes
  useEffect(() => {
    const total = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
    setTotalPrice(total);
  }, [cartItems]);

  // Update localStorage and state when quantity is changed
  const updateQuantity = (productId, newQuantity) => {
    const updatedCart = cartItems.map((item) =>
      item.productId === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem(`quantity-${productId}`, newQuantity);
  };

  const increaseQuantity = (productId) => {
    const product = cartItems.find((item) => item.productId === productId);
    updateQuantity(productId, product.quantity + 1);
  };

  const decreaseQuantity = (productId) => {
    const product = cartItems.find((item) => item.productId === productId);
    updateQuantity(productId, Math.max(0, product.quantity - 1));
  };

  // Handle payment (Placeholder)
  const handlePayment = () => {
    // Payment logic can be implemented here
    alert('Payment successful!');
    navigate('/'); // Redirect to home after payment
  };

  return (
    <div>
      <h1>Checkout</h1>
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div key={item.productId} className="food-card">
            <h2>{item.name}</h2>
            <p>Price: {item.price.toFixed(2)}</p> {/* Display price per item */}
            <div className="quantity-control">
              <button onClick={() => decreaseQuantity(item.productId)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => increaseQuantity(item.productId)}>+</button>
            </div>
          </div>
        ))
      ) : (
        <p>No items in the cart</p>
      )}
      <h3>Total Price: {totalPrice.toFixed(2)}</h3> {/* Display total price */}
      <Button onClick={handlePayment}>Pay Now</Button>
      <br />
      <Button onClick={() => navigate('/home')}>Back to Home</Button>
    </div>
  );
};

export default Checkout;
