import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Badge from './ui/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/Table.jsx';

const UserProfile = ({ loggedInUser, setLoggedInUser }) => {
  const userId = localStorage.getItem('userId'); // Assuming user ID is stored in localStorage
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [passengers, setPassengers] = useState([{ designation: '', firstName: '', lastName: '', dob: '', phone: '' }]);
  const [error, setError] = useState(null);

  // Define designations for passengers
  const designations = [
    { value: 'Mr', label: 'Mr' },
    { value: 'Mrs', label: 'Mrs' },
    { value: 'Miss', label: 'Miss' },
    { value: 'Dr', label: 'Dr' },
  ];

  // Fetch user data from the backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5050/user/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUserData(data);
        setOriginalData(data); // Store original data for cancellation
        setPassengers(data.passengers || []); // Sync passengers with user data
      } catch (error) {
        setError(error.message);
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleEdit = () => {
    if (isEditing) {
      // Save changes
      const updatedData = {
        name: userData.name,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        address: userData.address,
        passengers: passengers,
        bookings: userData.bookings,
      };

      // Update in backend
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
      setOriginalData(userData); // Store original data for cancellation
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setUserData(originalData); // Revert to original data
    setIsEditing(false);
  };

  // Handle changes to passenger data
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
    <div className="flex flex-col">
      <Navbar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
      <div className="p-4 bg-white shadow-md rounded-lg mt-4 max-w-7xl mx-auto">

        {/* User Information Section */}
        <h1 className="text-xl font-bold mb-4">User Profile</h1>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="detailItem">
            <span className="itemKey font-semibold">Username:</span>
            {isEditing ? (
              <input
                className="ml-2 border border-gray-300 rounded-md p-1"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              />
            ) : (
              <span className="itemValue">{userData.name}</span>
            )}
          </div>
          <div className="detailItem">
            <span className="itemKey font-semibold">Email:</span>
            {isEditing ? (
              <input
                className="ml-2 border border-gray-300 rounded-md p-1"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              />
            ) : (
              <span className="itemValue">{userData.email}</span>
            )}
          </div>
          <div className="detailItem">
            <span className="itemKey font-semibold">Phone Number:</span>
            {isEditing ? (
              <input
                className="ml-2 border border-gray-300 rounded-md p-1"
                value={userData.phoneNumber}
                onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
              />
            ) : (
              <span className="itemValue">{userData.phoneNumber}</span>
            )}
          </div>
          <div className="detailItem">
            <span className="itemKey font-semibold">Address:</span>
            {isEditing ? (
              <input
                className="ml-2 border border-gray-300 rounded-md p-1"
                value={userData.address}
                onChange={(e) => setUserData({ ...userData, address: e.target.value })}
              />
            ) : (
              <span className="itemValue">{userData.address}</span>
            )}
          </div>
          <div className="flex items-center justify-end col-span-3">
            <button
              className={`bg-blue-500 text-white p-2 rounded-md ${isEditing ? 'mr-2' : ''}`}
              onClick={handleEdit}
            >
              {isEditing ? 'Save Changes' : 'Edit'}
            </button>
            {isEditing && (
              <button
                className="bg-red-500 text-white p-2 rounded-md"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Passengers Section */}
        <h2 className="text-xl font-bold mb-4">Passengers</h2>
        <div className="flex flex-col gap-4 mb-4">
          {passengers.map((passenger, index) => (
            <div key={index} className="passengerCard p-4 bg-gray-50 rounded-md shadow">
              <div className="grid grid-cols-3 gap-4 mb-2">
                <div className="detailItem">
                  <span className="itemKey font-semibold">Designation:</span>
                  <select
                    className="ml-2 border border-gray-300 rounded-md p-1"
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
                    className="ml-2 border border-gray-300 rounded-md p-1"
                    name="firstName"
                    value={passenger.firstName}
                    onChange={(e) => handlePassengerChange(index, e)}
                  />
                </div>
                <div className="detailItem">
                  <span className="itemKey font-semibold">Last Name:</span>
                  <input
                    className="ml-2 border border-gray-300 rounded-md p-1"
                    name="lastName"
                    value={passenger.lastName}
                    onChange={(e) => handlePassengerChange(index, e)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="detailItem">
                  <span className="itemKey font-semibold">Date of Birth:</span>
                  <input
                    className="ml-2 border border-gray-300 rounded-md p-1"
                    name="dob"
                    type="date"
                    value={passenger.dob}
                    onChange={(e) => handlePassengerChange(index, e)}
                  />
                </div>
                <div className="detailItem">
                  <span className="itemKey font-semibold">Phone:</span>
                  <input
                    className="ml-2 border border-gray-300 rounded-md p-1"
                    name="phone"
                    value={passenger.phone}
                    onChange={(e) => handlePassengerChange(index, e)}
                  />
                </div>
                <div className="flex items-center justify-center mt-4">
                  <button
                    className="bg-red-500 text-white p-2 rounded-md"
                    onClick={() => removePassenger(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            className="bg-green-500 text-white p-2 rounded-md mt-2"
            onClick={addPassenger}
          >
            Add Passenger
          </button>
        </div>

        {/* Booking Table */}
        <h2 className="text-xl font-bold mb-4">Bookings</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userData.bookings.map((booking, index) => (
              <TableRow key={index}>
                <TableCell>{booking.bookingId}</TableCell>
                <TableCell>{booking.from}</TableCell>
                <TableCell>{booking.to}</TableCell>
                <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                <TableCell>{booking.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserProfile;
