import React from 'react';

const MailList = () => {
  return (
    <div className="mt-[5vh] bg-[#003580] text-white w-full flex flex-col items-center gap-[2vh] py-[5vh] px-0 mb-0">
      <h1 className="text-3xl font-bold text-white">Save time, save money!</h1>
      <span className="text-lg text-center text-white">Sign up and we'll send the best deals to you</span>
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-[80vw] justify-center"> 
        <input 
          type="text" 
          placeholder="Your Email" 
          className="text-black h-[6vh] w-[40vw] max-w-[300px] px-3 rounded-md border-none shadow-md focus:outline-none focus:ring-2 focus:ring-[#46affb] transition-shadow duration-300" 
        />
        <button 
          className="h-[6vh] w-[30vw] max-w-[200px] bg-gradient-to-r from-[#3b82f6] to-[#4a90e2] text-white font-semibold rounded-md px-3 transition duration-300 hover:opacity-90 shadow-md hover:shadow-lg"
        >
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default MailList;