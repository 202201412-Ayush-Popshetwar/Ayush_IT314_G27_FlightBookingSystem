import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import Header from "./Header";
import Footer from "./Footer";
import { Autocomplete, TextField } from '@mui/material';

const BookingForm = ({ loggedInUser, setLoggedInUser }) => {
  if(!loggedInUser){
    return <Navigate to="/" />
  }
  const passengerCount = JSON.parse(localStorage.getItem('options'))?.adult + JSON.parse(localStorage.getItem('options'))?.children || 2; 
  const [formData, setFormData] = useState(Array(passengerCount).fill().map(() => ({
    designation: '',
    firstName: '',
    lastName: '',
    dob: ''
  })));
  const navigate = useNavigate();
  const [savedPassengers, setSavedPassengers] = useState([]);
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phoneNumber: '',
  });

  const [usedPassengers, setUsedPassengers] = useState(new Set());

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`http://localhost:5050/user/${userId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const userData = await response.json();
        
        if (userData && Array.isArray(userData.passengers)) {
          setSavedPassengers(userData.passengers.map(passenger => ({
            ...passenger,
            label: `${passenger.firstName} ${passenger.lastName}`
          })));
        }

        if (userData) {
          setContactInfo({
            email: userData.email || '',
            phoneNumber: userData.phoneNumber || '',
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    if (loggedInUser) {
      fetchUserData();
    }
  }, [loggedInUser]);

  const handlePassengerSelect = (value, index) => {
    const updatedFormData = [...formData];
    
    const previousSelection = formData[index];
    if (previousSelection.firstName && previousSelection.lastName) {
      const previousLabel = `${previousSelection.firstName} ${previousSelection.lastName}`;
      setUsedPassengers(prev => {
        const updated = new Set(prev);
        updated.delete(previousLabel);
        return updated;
      });
    }
    
    if (!value) {
      updatedFormData[index] = {
        designation: '',
        firstName: '',
        lastName: '',
        dob: ''
      };
    } else {
      const passengerLabel = value.label;
      
      if (usedPassengers.has(passengerLabel)) {
        alert('This passenger is already selected in another form.');
        return;
      }
      
      const passenger = savedPassengers.find(p => 
        `${p.firstName} ${p.lastName}` === passengerLabel
      );

      if (passenger) {
        updatedFormData[index] = {
          designation: passenger.designation,
          firstName: passenger.firstName,
          lastName: passenger.lastName,
          dob: passenger.dob ? new Date(passenger.dob.$date || passenger.dob).toISOString().split('T')[0] : ''
        };
        
        setUsedPassengers(prev => new Set([...prev, passengerLabel]));
      }
    }
    
    setFormData(updatedFormData);
  };

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
    // Validate passenger details
    const isPassengersValid = formData.every(passenger => {
      return (
        passenger.designation && 
        passenger.firstName && 
        passenger.lastName && 
        passenger.dob
      );
    });

    // Validate contact information
    const isContactValid = (
      contactInfo.email && 
      contactInfo.email.includes('@') && 
      contactInfo.phoneNumber && 
      contactInfo.phoneNumber.length === 10 && 
      !isNaN(contactInfo.phoneNumber)
    );

    if (!isPassengersValid) {
      alert('Please fill in all passenger details');
      return;
    }

    if (!isContactValid) {
      if (!contactInfo.email || !contactInfo.email.includes('@')) {
        alert('Please enter a valid email address');
      } else if (!contactInfo.phoneNumber || contactInfo.phoneNumber.length !== 10 || isNaN(contactInfo.phoneNumber)) {
        alert('Please enter a valid 10-digit phone number');
      }
      return;
    }

    // If all validations pass, save to localStorage and navigate
    localStorage.setItem('passengerDetails', JSON.stringify(formData));
    localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
    navigate('/Addon');
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundImage: "url('/flight.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <Navbar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
      <Header type="list" />
      <div className="w-full mx-auto px-4 md:px-20 py-20">
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl text-blue-800 mb-4 font-bold">Flight Booking</h1>
          
          <h2 className="text-xl md:text-2xl text-blue-800 mb-6">Add Passenger Details</h2>
          <p className="mb-4"><sup className="text-red-400">*</sup> Mandatory Fields</p>
          
          {formData.map((passenger, index) => (
            <div key={index} className="relative mb-8 p-4 md:p-6 bg-white rounded-lg border border-gray-200 shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Passenger {index + 1}</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Search Saved Passengers</label>
                  <Autocomplete
                    options={savedPassengers.filter(passenger => 
                      !usedPassengers.has(passenger.label) || 
                      `${formData[index].firstName} ${formData[index].lastName}` === passenger.label
                    )}
                    getOptionLabel={(option) => option.label || ''}
                    onChange={(event, value) => handlePassengerSelect(value, index)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        className="w-full px-3 mt-1 focus:ring-blue-500"
                      />
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600">Designation<sup className="text-red-400">*</sup></label>
                  <select
                    id="designation"
                    value={passenger.designation}
                    onChange={(e) => handlePassengerChange(e, index)}
                    className="w-full p-2 border rounded-lg mt-1 text-gray-700 focus:ring-blue-500"
                    required
                  >
                    <option value="" disabled>Your Designation</option>
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
                    className="w-full p-2 border rounded-lg mt-1 text-gray-700 focus:ring-blue-500"
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
                    className="w-full p-2 border rounded-lg mt-1 text-gray-700 focus:ring-blue-500"
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
                    className="w-full p-2 border rounded-lg mt-1 text-gray-700 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          ))}

          <h2 className="text-xl md:text-2xl text-blue-800 mb-6">Contact Information</h2>
          <div className="relative mb-8 p-4 md:p-6 bg-white rounded-lg border border-gray-200 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600">Email Address<sup className="text-red-400">*</sup></label>
                <input
                  type="email"
                  id="email"
                  value={contactInfo.email}
                  onChange={handleContactChange}
                  placeholder="Enter Your Email"
                  className="w-full p-2 border rounded-lg mt-1 text-gray-700  focus:ring-blue-500"
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
                  className="w-full p-2 border rounded-lg mt-1 text-gray-700  focus:ring-blue-500"
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