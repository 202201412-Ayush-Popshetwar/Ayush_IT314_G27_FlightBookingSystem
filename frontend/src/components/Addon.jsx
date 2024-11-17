import React, { useState } from "react";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra"; // Seat icon
import LuggageIcon from "@mui/icons-material/Luggage"; // Baggage icon
import FastfoodIcon from "@mui/icons-material/Fastfood"; // Meals icon
import ShieldIcon from "@mui/icons-material/Shield"; // Insurance icon
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety"; // Passenger Assistance icon
import LocalAirportIcon from "@mui/icons-material/LocalAirport"; // Airport Services icon

const Addons = () => {
  const [addons, setAddons] = useState([
    { id: 1, name: "Baggage", description: "Ensure extra baggage allowance for your travels. Ideal for those who need more room for their belongings.", price: 500, icon: <LuggageIcon sx={{ color: "#003580", fontSize: 40 }} />, quantity: 0 },
    { id: 2, name: "Seats", description: "Choose your ideal seat to make your journey more comfortable. Select aisle, window, or extra legroom.", price: 300, icon: <AirlineSeatReclineExtraIcon sx={{ color: "#003580", fontSize: 40 }} />, quantity: 0 },
    { id: 3, name: "Meals", description: "Pre-order delicious meals on board. Choose from a variety of options to suit your preferences.", price: 400, icon: <FastfoodIcon sx={{ color: "#003580", fontSize: 40 }} />, quantity: 0 },
    { id: 4, name: "Insurance", description: "Travel with peace of mind with comprehensive insurance coverage for emergencies and travel issues.", price: 1000, icon: <ShieldIcon sx={{ color: "#003580", fontSize: 40 }} />, quantity: 0 },
    { id: 5, name: "Passenger Assistance", description: "Get medical and mobility assistance during your flight. Perfect for those who need extra care.", price: 700, icon: <HealthAndSafetyIcon sx={{ color: "#003580", fontSize: 40 }} />, quantity: 0 },
    { id: 6, name: "Airport Services", description: "Upgrade to priority check-in, faster security clearance, and more convenient services at the airport.", price: 800, icon: <LocalAirportIcon sx={{ color: "#003580", fontSize: 40 }} />, quantity: 0 },
  ]);

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
        addon.id === id && addon.quantity > 0
          ? { ...addon, quantity: addon.quantity - 1 }
          : addon
      )
    );
  };

  const totalPrice = addons.reduce((total, addon) => total + addon.price * addon.quantity, 0);

  return (
    <div className="bg-cover bg-center min-h-screen py-10 px-6" style={{ backgroundImage: "url('flight.jpg')" }}>
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-4xl font-semibold text-gray-800 mb-8 text-center">Enhance Your Travel Experience</h1>
        <div className="space-y-8">
          {addons.map((addon) => (
            <div
              key={addon.id}
              className="flex justify-between items-center border-b border-gray-300 pb-6"
            >
              <div className="flex items-center space-x-5">
                {addon.icon}
                <div>
                  <h2 className="text-xl font-medium text-gray-700">{addon.name}</h2>
                  <p className="text-base text-gray-500">{addon.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-8">
                <p className="text-lg font-medium text-gray-700">
                  ₹{addon.price * addon.quantity || addon.price}
                </p>
                {addon.quantity === 0 ? (
                  <button
                    className="px-6 py-3 bg-blue-600 text-white text-sm rounded-lg hover:bg-[#003580] transition duration-300"
                    onClick={() => handleIncrement(addon.id)}
                  >
                    Select Now
                  </button>
                ) : (
                  <div className="flex items-center space-x-3">
                    <button
                      className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded-lg hover:bg-gray-300 transition duration-300"
                      onClick={() => handleDecrement(addon.id)}
                    >
                      -
                    </button>
                    <span className="text-lg font-medium text-gray-700">{addon.quantity}</span>
                    <button
                      className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded-lg hover:bg-gray-300 transition duration-300"
                      onClick={() => handleIncrement(addon.id)}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Total: ₹{totalPrice}</h2>
          <button className="px-8 py-4 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-[#003580] transition duration-300">
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Addons;
