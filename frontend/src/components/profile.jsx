import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Header from "./Header";
import Footer from "./Footer";
import { Navigate } from 'react-router-dom';

const mockBookings = [
  {
    id: 'FL001',
    from: 'New York (JFK)',
    to: 'London (LHR)',
    date: '2024-03-15',
    class: 'Business',
    passengers: 2,
    status: 'Confirmed',
    price: '$2,450',
  },
  {
    id: 'FL002',
    from: 'London (LHR)',
    to: 'Paris (CDG)',
    date: '2024-02-28',
    class: 'Economy',
    passengers: 1,
    status: 'Completed',
    price: '$320',
  },
  {
    id: 'FL003',
    from: 'Dubai (DXB)',
    to: 'Singapore (SIN)',
    date: '2024-04-10',
    class: 'First Class',
    passengers: 2,
    status: 'Upcoming',
    price: '$4,800',
  },
];

const designations = [
  { value: '', label: 'Select Designation' },
  { value: 'Mr.', label: 'Mr.' },
  { value: 'Mrs.', label: 'Mrs.' },
  { value: 'Ms.', label: 'Ms.' },
  { value: 'Miss', label: 'Miss' },
];

const UserProfile = ({ loggedInUser, setLoggedInUser }) => {
  if (!loggedInUser) {
    return <Navigate to="/" />
  }
  const userId = localStorage.getItem('userId');
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [passengers, setPassengers] = useState([{ designation: '', firstName: '', lastName: '', dob: '', phone: '' }]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5050/user/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUserData(data);
        setOriginalData(data);
        setPassengers(data.passengers || []);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleEdit = () => {
    if (isEditing) {
      const updatedData = {
        name: userData.name,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        address: userData.address,
        passengers: passengers,
        bookings: userData.bookings,
      };

      const updateUserData = async () => {
        try {
          await fetch(`http://localhost:5050/user/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
          });
        } catch (error) {
          console.error('Error updating user data:', error);
        }
      };

      updateUserData();
    } else {
      setOriginalData(userData);
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setUserData(originalData);
    setIsEditing(false);
  };

  const handlePassengerChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [name]: value };
    setPassengers(updatedPassengers);
  };

  const removePassenger = (index) => {
    const updatedPassengers = passengers.filter((_, i) => i !== index);
    setPassengers(updatedPassengers);
  };

  const addPassenger = () => {
    if (passengers.length < 4) {
      setPassengers([...passengers, { designation: '', firstName: '', lastName: '', dob: '', phone: '' }]);
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundImage: "url('/flight.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <Navbar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
      <Header type="list" />
      
      <div className="py-20">
        <div className="p-4 bg-white mt-4 max-w-7xl mx-auto w-full rounded-lg shadow-sm">
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
                    localStorage.setItem('loggedInUser', e.target.value);
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
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Passengers Section */}
          <div className="flex flex-col gap-6 mb-6">
      {passengers.map((passenger, index) => (
        <div key={index} className="p-6 bg-gray-50 rounded-lg transition-all duration-200 hover:shadow-md">
          <div className="flex flex-col gap-4">
            {/* First Row */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[200px]">
                <span className="font-semibold text-gray-700 mr-2">Designation:</span>
                <select
                  className="border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <div className="flex-1 min-w-[200px]">
                <span className="font-semibold text-gray-700 mr-2">First Name:</span>
                <input
                  className="border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  name="firstName"
                  value={passenger.firstName}
                  onChange={(e) => handlePassengerChange(index, e)}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <span className="font-semibold text-gray-700 mr-2">Last Name:</span>
                <input
                  className="border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  name="lastName"
                  value={passenger.lastName}
                  onChange={(e) => handlePassengerChange(index, e)}
                />
              </div>
            </div>
            
            {/* Second Row */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[200px]">
                <span className="font-semibold text-gray-700 mr-2">Date of Birth:</span>
                <input
                  className="border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  name="dob"
                  type="date"
                  value={passenger.dob}
                  onChange={(e) => handlePassengerChange(index, e)}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <span className="font-semibold text-gray-700 mr-2">Phone:</span>
                <input
                  className="border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  name="phone"
                  type="tel"
                  value={passenger.phone}
                  onChange={(e) => handlePassengerChange(index, e)}
                />
              </div>
              <div className="flex gap-2 items-center">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-200"
                  onClick={() => removePassenger(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      {passengers.length < 4 && (
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded transition-colors duration-200 w-full md:w-auto"
          onClick={addPassenger}
        >
          Add Passenger
        </button>
      )}
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
                {mockBookings.map((booking) => (
                  <tr key={booking.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                    <td className="p-3">{booking.id}</td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span>{booking.from}</span>
                        <span className="text-sm text-gray-500">to</span>
                        <span>{booking.to}</span>
                        <span className="md:hidden text-sm text-gray-500">{booking.date}</span>
                      </div>
                    </td>
                    <td className="p-3 hidden md:table-cell">{booking.date}</td>
                    <td className="p-3">{booking.class}</td>
                    <td className="p-3 hidden md:table-cell">{booking.passengers}</td>
                    <td className="p-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-sm
                        ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : ''}
                        ${booking.status === 'Completed' ? 'bg-gray-100 text-gray-800' : ''}
                        ${booking.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : ''}
                        ${booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-3 text-right font-medium">{booking.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
        <Footer />
    </div>
  );
};

export default UserProfile;