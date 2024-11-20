import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Header from "./Header";
import Footer from "./Footer";
import { Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import axios from 'axios';
import { format } from 'date-fns';

const designations = [
  { value: '', label: 'Select Designation' },
  { value: 'Mr.', label: 'Mr.' },
  { value: 'Mrs.', label: 'Mrs.' },
  { value: 'Ms.', label: 'Ms.' },
  { value: 'Miss', label: 'Miss' },
];

const UserProfile = ({loggedInUser, setLoggedInUser}) => {
  if(!loggedInUser) {
    return <Navigate to="/" />
  }

  const userId = localStorage.getItem('userId');
  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState([]); 
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/user/${userId}`);
        if (response.data) {
          setUserData(response.data);
          setOriginalData(response.data);
          setPassengers(response.data.passengers || []);
        }
      } catch (error) {
        handleError('Error fetching user data');
        console.error('Error fetching user data:', error);
      }
    };

    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/user/${userId}/bookings`);
        if (response.data) {
          setBookings(response.data);
        }
      } catch (error) {
        handleError('Error fetching bookings');
        console.error('Error fetching bookings:', error);
      }
    };

    if (userId) {
      fetchUserData();
      fetchBookings();
    }
  }, [userId]);

  const handleEdit = async () => {
    if (isEditing) {
      try {
        // Validation
        const nameRegex = /^[A-Za-z\s]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;
        
        if (!nameRegex.test(userData.name)) {
          handleError('Name must contain only alphabets and spaces.');
          return;
        }
        if (!emailRegex.test(userData.email)) {
          handleError('Please enter a valid email address.');
          return;
        }
        if (!phoneRegex.test(userData.phoneNumber)) {
          handleError('Phone number must be a 10-digit number.');
          return;
        }
        if (!nameRegex.test(userData.address)) {
          handleError('Address must contain only alphabets and spaces.');
          return;
        }

        const updatedData = {
          name: userData.name,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          address: userData.address
        };

        const response = await axios.put(`http://localhost:5050/user/${userId}`, updatedData);
        if (response.data) {
          setUserData(response.data);
          setOriginalData(response.data);
          handleSuccess('Profile updated successfully');
          setLoggedInUser(response.data.name);
          localStorage.setItem('loggedInUser', response.data.name);
        }
      } catch (error) {
        handleError('Error updating profile');
        console.error('Error updating profile:', error);
      }
    }
    setIsEditing(!isEditing);
  };

  const toggleEdit = (index, isEditing) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index].isEditing = isEditing;
    setPassengers(updatedPassengers);
  };
  
  const handleCancel = () => {
    const filteredPassengers = passengers.filter(passenger => passenger._id);

    // Revert to original data and remove unsaved passengers
    setPassengers(filteredPassengers);
    setUserData(originalData); // Revert other user data to original
    setIsEditing(false); // Exit edit mode
  };

  const handlePassengerChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [name]: value };
    setPassengers(updatedPassengers);
    console.log(name,value);
  };

  const removePassenger = async (index) => {
    try {
      const passenger = passengers[index];
  
      // Check if the passenger has an `_id` (only saved passengers need a backend DELETE request)
      if (!passenger._id) {
        // Remove the passenger locally for unsaved passengers
        setPassengers(passengers.filter((_, i) => i !== index));
        return;
      }
  
      // For saved passengers, proceed with backend DELETE request
      const passengerId = passenger._id; 
  
      const response = await fetch(`http://localhost:5050/user/${userId}/${passengerId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) throw new Error('Failed to remove passenger');
  
      // Update the local state after successful removal
      handleSuccess('Passenger removed successfully');
      setPassengers(passengers.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error removing passenger:', error);
      handleError('Error removing passenger. Please try again.');
    }
  };
  
  
  const saveChanges = async (index) => {
    const passenger = passengers[index];
    const nameRegex = /^[A-Za-z\s]+$/;
    console.log(passengers);
    if (
      !passenger.designation ||
      !passenger.firstName ||
      !passenger.lastName ||
      !passenger.dob ||
      !passenger.phone
      ){
      // Use a toast library like react-toastify to display the error
      handleError('All details are required.');
      return;
    }
    if (!nameRegex.test(passenger.firstName)) {
      handleError('First name must only contain alphabets.');
      return;
    }
  
    if (!nameRegex.test(passenger.lastName)) {
      handleError('Last name must only contain alphabets.');
      return;
    }
  
    const today = new Date();
    const dob = new Date(passenger.dob);
  
    if (dob >= today) {
      handleError('Date of birth must be before the current date.');
      return;
    }
  
    if (passenger.phone.length !== 10 || isNaN(passenger.phone)) {
      handleError('Phone number must be a 10-digit number.');
      return;
    }
    const isDuplicate = passengers.some(
      (p, i) =>
        i !== index && // Exclude the current passenger based on its index
        p.firstName === passenger.firstName &&
        p.lastName === passenger.lastName &&
        p.dob === passenger.dob
    );

    if (isDuplicate) {
      handleError('Passenger with the same name and date of birth already exists.');
      return;
    }
    try {
      // Save changes to backend
      const response = await fetch(`http://localhost:5050/user/${userId}/passengers`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passengers }),
      });
      if (!response.ok) throw new Error('Failed to update passengers');
      toggleEdit(index, false);
      handleSuccess('Passenger details saved successfully!');
    } catch (error) {
      console.error('Error updating passengers:', error);
      handleError('Error updating passengers. Please try again.');
    }
  };
  
  const addPassenger = () => {
    if (passengers.length < 4) {
      setPassengers([...passengers, { designation: 'Mr', firstName: '', lastName: '', dob:'', phone: '', isEditing: true }]);
    }
  };
  
  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen " style={{ backgroundImage: "url('/flight.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} >
      <Navbar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
      <Header type="list" />
      
      <div className="py-20">
        <div className="p-4 bg-white mt-4 px-60 py-20 mx-auto w-10/12 rounded-lg shadow-sm space-y-8 ">
          {/* User Information Section */}
          <h1 className="text-2xl font-bold mb-6">User Profile</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="detailItem transition-all duration-200 hover:bg-gray-50 p-3 rounded-md">
              <span className="itemKey font-semibold text-gray-700">Username: </span>
              {isEditing ? (
                <input
                  className="ml-2 border border-gray-300 rounded p-2 w-2/3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={userData.name}
                  onChange={(e) => {
                    setUserData({ ...userData, name: e.target.value });
                    
                  }}
                />
              ) : (
                <span className="itemValue">{userData.name}</span>
              )}
            </div>
            <div className="detailItem transition-all duration-200 hover:bg-gray-50 p-3 rounded-md">
              <span className="itemKey font-semibold text-gray-700">Email: </span>
              {isEditing ? (
                <input
                  className="ml-2 border border-gray-300 rounded p-2 w-2/3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  type="email"
                />
              ) : (
                <span className="itemValue">{userData.email}</span>
              )}
            </div>
            <div className="detailItem transition-all duration-200 hover:bg-gray-50 p-3 rounded-md">
              <span className="itemKey font-semibold text-gray-700">Phone Number: </span>
              {isEditing ? (
                <input
                  className="ml-2 border border-gray-300 rounded p-2 w-2/3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={userData.phoneNumber}
                  onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
                  type="tel"
                />
              ) : (
                <span className="itemValue">{userData.phoneNumber}</span>
              )}
            </div>
            <div className="detailItem transition-all duration-200 hover:bg-gray-50 p-3 rounded-md">
              <span className="itemKey font-semibold text-gray-700">Address: </span>
              {isEditing ? (
                <input
                  className="ml-2 border border-gray-300 rounded p-2 w-2/3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={userData.address}
                  onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                />
              ) : (
                <span className="itemValue">{userData.address}</span>
              )}
            </div>
            <div className="flex items-center justify-end col-span-full">
              <button
                className={`bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition-colors duration-200 ${isEditing ? 'mr-2' : ''}`}
                onClick={handleEdit}
              >
                {isEditing ? 'Save Changes' : 'Edit'}
              </button>
              {isEditing && (
                <button
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition-colors duration-200"
                  onClick={handleCancel}
                >
                  Delete
                </button>
              )}
            </div>
          </div>

        {/* Passengers Section */}
        <h2 className="text-xl font-bold mb-4 ">Passengers</h2>
          <div className="flex flex-col gap-5 mb-4">
            {passengers.map((passenger, index) => (
              <div key={index} className="passengerCard p-4 bg-gray-50 rounded-md shadow transition-all duration-200 hover:shadow-lg">
                {!passenger.isEditing ? (
                  // Display Mode
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                      <div className="detailItem">
                        <span className="itemKey font-semibold">Designation:</span> {passenger.designation}
                      </div>
                      <div className="detailItem">
                        <span className="itemKey font-semibold">First Name:</span> {passenger.firstName}
                      </div>
                      <div className="detailItem">
                        <span className="itemKey font-semibold">Last Name:</span> {passenger.lastName}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                      <div className="detailItem">
                        <span className="itemKey font-semibold">Date of Birth:</span>
                        {passenger.dob ? new Date(passenger.dob).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="detailItem">
                        <span className="itemKey font-semibold">Phone:</span> {passenger.phone}
                      </div>
                      <div className="detailItem flex items-center">
                        <button
                          className="bg-blue-500 text-white p-1 rounded-md"
                          onClick={() => toggleEdit(index, true)}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Edit Mode
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                      <div className="detailItem">
                        <span className="itemKey font-semibold">Designation:</span>
                        <select
                          className="ml-2 border border-gray-300 rounded-md p-1 w-full"
                          name="designation"
                          value={passenger.designation}
                          onChange={(e) => handlePassengerChange(index, e)}
                        >
                          {designations.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey font-semibold">First Name:</span>
                        <input
                          className="ml-2 border border-gray-300 rounded-md p-1 w-full"
                          name="firstName"
                          value={passenger.firstName}
                          onChange={(e) => handlePassengerChange(index, e)}
                        />
                      </div>
                      <div className="detailItem">
                        <span className="itemKey font-semibold">Last Name:</span>
                        <input
                          className="ml-2 border border-gray-300 rounded-md p-1 w-full"
                          name="lastName"
                          value={passenger.lastName}
                          onChange={(e) => handlePassengerChange(index, e)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                      <div className="detailItem">
                        <span className="itemKey font-semibold">Date of Birth:</span>
                        <input
                          className="ml-2 border border-gray-300 rounded-md p-1 w-full"
                          name="dob"
                          type="date"
                          value={passenger.dob}
                          onChange={(e) => handlePassengerChange(index, e)}
                        />
                      </div>
                      <div className="detailItem">
                        <span className="itemKey font-semibold">Phone:</span>
                        <input
                          className="ml-2 border border-gray-300 rounded-md p-1 w-full"
                          name="phone"
                          value={passenger.phone}
                          onChange={(e) => handlePassengerChange(index, e)}
                        />
                      </div>
                      <div className="detailItem flex items-center gap-2">
                        <button
                          className="bg-green-500 text-white p-1 rounded-md"
                          onClick={() => saveChanges(index)}
                        >
                          Save Changes
                        </button>
                        <button
                          className= "bg-red-500 text-white p-1 rounded-md"
                          onClick={() => removePassenger(index)}
          >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="flex gap-4">
              {passengers.length < 4 && (
                <button className="bg-blue-500 text-white p-2 rounded-md" onClick={addPassenger}>
                  Add Passenger
                </button>
              )}
            </div>
          </div>

          {/* Booking History Section */}
          <h2 className="text-2xl font-bold mb-6 mt-10">Booking History</h2>
          <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full border-collapse bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left font-semibold text-gray-700">Booking ID</th>
                <th className="p-3 text-left font-semibold text-gray-700">Route</th>
                <th className="p-3 text-left font-semibold text-gray-700 hidden md:table-cell">Date</th>
                <th className="p-3 text-left font-semibold text-gray-700">Class</th>
                <th className="p-3 text-left font-semibold text-gray-700 hidden md:table-cell">Passengers</th>
                <th className="p-3 text-left font-semibold text-gray-700">Status</th>
                <th className="p-3 text-right font-semibold text-gray-700">Price</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <td className="p-3">{booking._id}</td>
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span>{booking.from}</span>
                      <span className="text-sm text-gray-500">to</span>
                      <span>{booking.to}</span>
                      <span className="md:hidden text-sm text-gray-500">{booking.date}</span>
                    </div>
                  </td>
                  <td className="p-3 hidden md:table-cell">{new Date(booking.date).toLocaleDateString()}</td>
                  <td className="p-3">{booking.class}</td>
                  <td className="p-3 hidden md:table-cell">{booking.passengers}</td>
                  <td className="p-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-sm
                      ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : ''}
                      ${booking.status === 'Completed' ? 'bg-gray-100 text-gray-800' : ''}
                      ${booking.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : ''}
                      ${booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                      ${booking.status === 'Pending' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-3 text-right font-medium">{booking.price}$</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>
      <Footer/>
      <ToastContainer/>
    </div>
  );
};

export default UserProfile;