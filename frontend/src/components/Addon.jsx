import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import Header from "./Header";
import Footer from "./Footer";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra"; // Seat icon
import LuggageIcon from "@mui/icons-material/Luggage"; // Baggage icon
import FastfoodIcon from "@mui/icons-material/Fastfood"; // Meals icon
import ShieldIcon from "@mui/icons-material/Shield"; // Insurance icon
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety"; // Passenger Assistance icon
import LocalAirportIcon from "@mui/icons-material/LocalAirport"; // Airport Services icon

const Addons = ({ loggedInUser  , setLoggedInUser   }) => {
  const [addons, setAddons] = useState([
    { id: 1, name: "Baggage", description: "Ensure extra baggage allowance for your travels.", price: 500, icon: <LuggageIcon sx={{ color: "#003580", fontSize: 40 }} />, quantity: 0, varieties: [{ name: "Standard", price: 500 }, { name: "Premium", price: 800 }] },
    { id: 2, name: "Seats", description: "Choose your ideal seat to make your journey more comfortable.", price: 300, icon: <AirlineSeatReclineExtraIcon sx={{ color: "#003580", fontSize: 40 }} />, quantity: 0, varieties: [{ name: "Aisle", price: 300 }, { name: "Window", price: 350 }, { name: "Extra Legroom", price: 400 }] },
    { id: 3, name: "Meals", description: "Pre-order delicious meals on board.", price: 400, icon: <FastfoodIcon sx={{ color: "#003580", fontSize: 40 }} />, quantity: 0, varieties: [{ name: "Vegetarian", price: 400 }, { name: "Non-Vegetarian", price: 450 }, { name: "Vegan", price: 500 }] },
    { id: 4, name: "Insurance", description: "Travel with peace of mind with comprehensive insurance coverage.", price: 1000, icon: <ShieldIcon sx={{ color: "#003580", fontSize: 40 }} />, quantity: 0, varieties: [{ name: "Basic", price: 1000 }, { name: "Comprehensive", price: 1500 }] },
    { id: 5, name: "Passenger Assistance", description: "Get medical and mobility assistance during your flight.", price: 700, icon: <HealthAndSafetyIcon sx={{ color: "#003580", fontSize: 40 }} />, quantity: 0, varieties: [{ name: "Standard", price: 700 }, { name: "Premium", price: 1000 }] },
    { id: 6, name: "Airport Services", description: "Upgrade to priority check-in, faster security clearance.", price: 800, icon: <LocalAirportIcon sx={{ color: "#003580", fontSize: 40 }} />, quantity: 0, varieties: [{ name: "Standard", price: 800 }, { name: "VIP", price: 1200 }] },
  ]);

  const [selectedVarieties, setSelectedVarieties] = useState({});
  const navigate = useNavigate();

  const handleIncrement = (id) => {
    setAddons((prevAddons) =>
      prevAddons.map((addon) =>
        addon.id === id ? { ...addon, quantity: addon.quantity + 1 } : addon
      )
    );
  };

  const handleDecrement = (id) => {
    setAddons((prevAddons) =>
      prevAddons.map((addon) =>
        addon.id === id && addon.quantity > 0 ? { ...addon, quantity: addon.quantity - 1 }
          : addon
      )
    );
  };

  const handleVarietyChange = (id, variety) => {
    setSelectedVarieties((prev) => ({ ...prev, [id]: variety }));
  };

  const totalPrice = addons.reduce((total, addon) => {
    const selectedVariety = selectedVarieties[addon.id];
    const price = selectedVariety ? selectedVariety.price : addon.price;
    return total + price * addon.quantity;
  }, 0);

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundImage: "url('/flight.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <Navbar loggedInUser ={loggedInUser } setLoggedInUser ={setLoggedInUser } />
      <Header type="list" />
      <div className="flex flex-col w-full max-w-screen-lg mx-auto bg-white shadow-xl rounded-xl p-4 md:p-8 my-10">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-8 text-center">Enhance Your Travel Experience</h1>
        <div className="space-y-8">
          {addons.map((addon) => (
            <div key={addon.id} className="flex flex-col md:flex-row justify-between items-center border-b border-gray-300 pb-6">
              <div className="flex items-center space-x-5">
                {addon.icon}
                <div>
                  <h2 className="text-lg md:text-xl font-medium text-gray-700">{addon.name}</h2>
                  <p className="text-sm md:text-base text-gray-500">{addon.description}</p>
                  <select className="mt-2 p-2 border rounded-lg" onChange={(e) => handleVarietyChange(addon.id, addon.varieties[e.target.selectedIndex - 1])}>
                    <option value="" disabled selected>Select Variety</option>
                    {addon.varieties.map((variety, index) => (
                      <option key={index} value={variety.name}>{variety.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-8 mt-4 md:mt-0">
                <p className="text-lg font-medium text-gray-700">₹{selectedVarieties[addon.id] ? selectedVarieties[addon.id].price * addon.quantity : addon.price * addon.quantity}</p>
                {selectedVarieties[addon.id] ? (
                  <div className="flex items-center space-x-3">
                    <button
                      className="px-4 py-2 bg-blue-700 text-white text-sm rounded-lg hover:bg-gray-300 transition duration-300"
                      onClick={() => handleDecrement(addon.id)}
                    >
                      -
                    </button>
                    <span className="text-lg font-medium text-gray-700">{addon.quantity}</span>
                    <button
                      className="px-4 py-2 bg-blue-700 text-white text-sm rounded-lg hover:bg-gray-300 transition duration-300"
                      onClick={() => handleIncrement(addon.id)}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button className="px-6 py-3 bg-blue-700 text-white text-sm rounded-lg cursor-not-allowed" disabled>
                    Select Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-screen-lg mb-8 mx-auto bg-gray-100 p-4 rounded-lg mt-4">
        <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-4">Selected Addons</h2>
        <ul>
          {addons.map((addon) => {
            const selectedVariety = selectedVarieties[addon.id];
            return (
              selectedVariety && addon.quantity > 0 && (
                <li key={addon.id} className="flex justify-between mb-2">
                  <span>{addon.name} ({selectedVariety.name})</span>
                  <span>₹{selectedVariety.price * addon.quantity}</span>
                </li>
              )
            );
          })}
        </ul>
        <div className="mt-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Total: ₹{totalPrice}</h2>
          <button
            type="button"
            onClick={() => navigate('/payment')}
            className="px-8 py-6  bg-blue-700 text-white text-lg font-semibold rounded-lg hover:bg-[#003580] transition duration-300"
          >
            Continue to Payment
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Addons;