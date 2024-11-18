import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import Header from "./Header";
import Footer from "./Footer";

const BookingForm = ({ loggedInUser , setLoggedInUser  }) => {
  // Fixed number of passengers: 2 adults and 1 child
  const [formData, setFormData] = useState([
    { designation: '', firstName: '', lastName: '', dob: '' }, // Adult 1
    { designation: '', firstName: '', lastName: '', dob: '' }, // Adult 2
    { designation: '', firstName: '', lastName: '', dob: '' }, // Child 1
  ]);

  const [contactInfo, setContactInfo] = useState({
    email: '',
    phoneNumber: '',
  });

  const navigate = useNavigate();

  const handlePassengerChange = (e, index) => {
    const { id, value } = e.target;
    const updatedFormData = [...formData];
    updatedFormData[index][id] = value;
    setFormData(updatedFormData);
  };

  const handleContactChange = (e) => {
    const { id, value } = e.target;
    setContactInfo({ ...contactInfo, [id]: value });
  };

  const handleSubmit = () => {
    // Here you can add validation if needed
    localStorage.setItem('passengerDetails', JSON.stringify(formData));
    localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
    navigate('/Addon'); // Navigating to the Addons Page
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundImage: "url('/flight.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <Navbar loggedInUser ={loggedInUser } setLoggedInUser ={setLoggedInUser } />
      <Header type="list" />
      <div className="w-full mx-auto px-40 py-20">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl text-blue-800 mb-4 font-bold">Flight Booking</h1>
          <h2 className=" text-2xl text-blue-800 mb-6">Add Passenger Details</h2>
          <p className="mb-4"><sup className="text-red-400">*</sup> Mandatory Fields</p>
          {formData.map((passenger, index) => (
            <div key={index} className="relative mb-8 p-6 bg-white rounded-lg border border-gray-200 shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Passenger {index + 1}</h3>

              <div className="grid grid-cols-1 md:grid-cols-4  gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600">Designation<sup className="text-red-400">*</sup></label>
                  <select
                    id="designation"
                    value={passenger.designation}
                    onChange={(e) => handlePassengerChange(e, index)}
                    className={`w-full p-2 border rounded-lg mt-1 ${passenger.designation === '' ? 'text-gray-400' : 'text-gray-700'}`}
                    required
                  >
                    <option value="" disabled className="text-gray-400">Your Designation</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Miss">Miss</option>
                    <option value="Ms">Ms</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600">First Name<sup className="text-red-400">*</sup></label>
                  <input
                    type="text"
                    id="firstName"
                    value={passenger.firstName}
                    onChange={(e) => handlePassengerChange(e, index)}
                    placeholder="Enter Your First Name"
                    className="w-full p-2 border rounded-lg mt-1 text-gray-700 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600">Last Name<sup className="text-red-400">*</sup></label>
                  <input
                    type="text" 
                    id="lastName"
                    value={passenger.lastName}
                    onChange={(e) => handlePassengerChange(e, index)}
                    placeholder="Enter Your Last Name"
                    className="w-full p-2 border rounded-lg mt-1 text-gray-700 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600">Date of Birth<sup className="text-red-400">*</sup></label>
                  <input
                    type="date"
                    id="dob"
                    value={passenger.dob}
                    onChange={(e) => handlePassengerChange(e, index)}
                    className="w-full p-2 border rounded-lg mt-1 text-gray-700 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
          {/* Contact Information Section */}
          <h2 className="text-2xl text-blue-800 mb-6">Contact Information</h2>
          <div className="relative mb-8 p-6 bg-white rounded-lg border border-gray-200 shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Contact Details</h3>

            {/* Grid layout for Email and Phone Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600">Email Address<sup className="text-red-400">*</sup></label>
                <input
                  type="email"
                  id="email"
                  value={contactInfo.email}
                  onChange={handleContactChange}
                  placeholder="Enter Your Email"
                  className="w-full p-2 border rounded-lg mt-1 text-gray-700 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600">Phone Number<sup className="text-red-400">*</sup></label>
                <input
                  type="text"
                  id="phoneNumber"
                  value={contactInfo.phoneNumber}
                  onChange={handleContactChange}
                  placeholder="Enter Your Phone Number"
                  className="w-full p-2 border rounded-lg mt-1 text-gray-700 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md hover:bg-gradient-to-l transition"
            >
              Continue to Extras
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingForm;