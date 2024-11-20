import React, { useState } from 'react';
import { handleError, handleSuccess } from '../utils';

const MailList = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      handleError('Please enter an email address');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        handleSuccess(data.message);
        setEmail('');
      } else {
        handleError(data.message || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      handleError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-[5vh] bg-[#003580] text-white w-full flex flex-col items-center gap-[2vh] py-[5vh] px-0 mb-0">
      <h1 className="text-3xl font-bold text-white">Save time, save money!</h1>
      <span className="text-lg text-center text-white">Sign up and we'll send the best deals to you</span>
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-[80vw] justify-center"> 
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email" 
          className="text-black h-[6vh] w-[40vw] max-w-[300px] px-3 rounded-md border-none shadow-md focus:outline-none focus:ring-2 focus:ring-[#46affb] transition-shadow duration-300" 
        />
        <button 
          onClick={handleSubmit}
          disabled={isLoading}
          className="h-[6vh] w-[30vw] max-w-[200px] bg-gradient-to-r from-[#3b82f6] to-[#4a90e2] text-white font-semibold rounded-md px-3 transition duration-300 hover:opacity-90 shadow-md hover:shadow-lg disabled:opacity-50"
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>
    </div>
  );
};

export default MailList;
