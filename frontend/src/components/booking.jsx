import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from "./Navbar";
const BookingForm = ({ loggedInUser,setLoggedInUser}) => {
  const [formData, setFormData] = useState([
    {
      designation: '',
      firstName: '',
      lastName: '',
      dob: '',
      phoneNumber: '',
    },
  ]);
  
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const { id, value } = e.target;
    const updatedFormData = [...formData];
    updatedFormData[index][id] = value;
    setFormData(updatedFormData);
  };

  const addPassenger = () => {
    setFormData([
      ...formData,
      { designation: '', firstName: '', lastName: '', dob: '', phoneNumber: '' },
    ]);

    console.log(formData);
  };

  const removePassenger = (index) => {
    setFormData(formData.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    localStorage.setItem('passengerDetails', JSON.stringify(formData));
    navigate('/payment'); // Navigating to the Payment Page
  };

  return (
    <div>
    <Navbar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-blue-300 p-4 sm:p-8">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-xl p-8 sm:p-10 lg:p-12">
        <h1 className="text-3xl font-semibold text-center text-blue-800 mb-8">Flight Booking</h1>
        <h2 className="text-xl text-center mb-6">Passenger Details</h2>
        {formData.map((passenger, index) => (
          <div key={index} className="relative mb-8 p-6 bg-gradient-to-r from-white to-gray-100 rounded-lg border border-gray-200 shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 text-center mb-4">Passenger {index + 1}</h3>

            {index === formData.length - 1 && (
              <button
                type="button"
                onClick={addPassenger}
                className="absolute w-10 top-2 right-2 p-1 text-2xl font-bold text-black rounded-md hover:bg-blue-200 transition"
              >
                +
              </button>
            )}

            {index !== 0 && (
              <button
                type="button"
                onClick={() => removePassenger(index)}
                className="absolute w-10 top-2 right-14 p-1 text-2xl font-bold text-black rounded-md hover:bg-red-200 transition"
              >
                -
              </button>
            )}

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600">Designation<sup className="text-red-400">*</sup></label>
              <select
                id="designation"
                value={passenger.designation}
                onChange={(e) => handleChange(e, index)}
                className={`w-full p-2 border rounded-lg mt-1 ${
                  passenger.designation === '' ? 'text-gray-400' : 'text-gray-700'
                }`}
              >
                <option value="" disabled className="text-gray-400">Your Designation</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Miss">Miss</option>
                <option value="Ms">Ms</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600">First Name<sup className="text-red-400">*</sup></label>
              <input
                type="text"
                id="firstName"
                value={passenger.firstName}
                onChange={(e) => handleChange(e, index)}
                placeholder="Enter Your First Name"
                className="w-full p-2 border rounded-lg mt-1 text-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600">Last Name<sup className="text-red-400">*</sup></label>
              <input
                type="text"
                id="lastName"
                value={passenger.lastName}
                onChange={(e) => handleChange(e, index)}
                placeholder="Enter Your Last Name"
                className="w-full p-2 border rounded-lg mt-1 text-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600">Date of Birth<sup className="text-red-400">*</sup></label>
              <input
                type="date"
                id="dob"
                value={passenger.dob}
                onChange={(e) => handleChange(e, index)}
                className="w-full p-2 border rounded-lg mt-1 text-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600">Phone Number<sup className="text-red-400">*</sup></label>
              <input
                type="text"
                id="phoneNumber"
                value={passenger.phoneNumber}
                onChange={(e) => handleChange(e, index)}
                placeholder="Enter Your Number"
                className="w-full p-2 border rounded-lg mt-1 text-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}
        <p className="text-center mb-4"><sup className="text-red-400">*</sup> Mandatory Fields</p>
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md hover:bg-gradient-to-l transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default BookingForm;
