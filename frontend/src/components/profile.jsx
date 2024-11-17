import React, { useState,useEffect } from 'react';
import Navbar from './Navbar'; 
import {Navigate} from 'react-router-dom';
import { format } from 'date-fns';
import Badge from './ui/Badge'; 
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/Table'; 


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

const statusColors = {
  Confirmed: 'bg-green-100 text-green-800',
  Completed: 'bg-gray-100 text-gray-800',
  Upcoming: 'bg-blue-100 text-blue-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const classColors = {
  Economy: 'bg-gray-100 text-gray-800',
  Business: 'bg-purple-100 text-purple-800',
  'First Class': 'bg-amber-100 text-amber-800',
};

const designations = [
  { value: '', label: 'Select Designation' },
  { value: 'Mr.', label: 'Mr.' },
  { value: 'Mrs.', label: 'Mrs.' },
  { value: 'Ms.', label: 'Ms.' },
  { value: 'Miss', label: 'Miss' },
];
const formatDate = (isoDate) => {
  return format(new Date(isoDate), 'MMMM d, yyyy'); // e.g., "June 13, 2000"
};
const UserProfile = ({loggedInUser,setLoggedInUser}) => {
  if(!loggedInUser){
    return <Navigate to="/" />
  }
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

  // Handle changes to passenger data
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
      const passengerId = passenger._id; // Assuming MongoDB provides `_id` for passengers
      console.log(index);
      console.log(passenger);
      console.log(passengerId);
  
      const response = await fetch(`http://localhost:5050/user/${userId}/${passengerId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) throw new Error('Failed to remove passenger');
  
      // Update the local state after successful removal
      alert('Passenger removed successfully');
      setPassengers(passengers.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error removing passenger:', error);
      alert('Error removing passenger. Please try again.');
    }
  };
  
  
  const saveChanges = async (index) => {
    const passenger = passengers[index];
    console.log(passenger);
    // Validation logic
    if (
      !passenger.designation ||
      !passenger.firstName ||
      !passenger.lastName ||
      !passenger.dob ||
      !passenger.phone ||
      passenger.phone.length !== 10 ||
      isNaN(passenger.phone)
    ) {
      // Use a toast library like react-toastify to display the error
      handleError('All details are required. Phone number must be a 10-digit number.');
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
      alert('Passenger details saved successfully!');
    } catch (error) {
      console.error('Error updating passengers:', error);
      alert('Error updating passengers. Please try again.');
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
                onChange={(e) =>{ 
                  setUserData({ ...userData, name: e.target.value })
                  localStorage.setItem('loggedInUser',e.target.value);
                
                }
              }
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
      {!passenger.isEditing ? (
        // Display Mode
        <div>
          <div className="grid grid-cols-3 gap-4 mb-2">
            <div className="detailItem">
              <span className="itemKey font-semibold">Designation:</span> {passenger.designation}
            </div>
            <div className="detailItem">
              <span className="itemKey font-semibold">First Name:</span> {passenger.firstName}
            </div>
            <div className="detailItem">
              <span className="itemKey font-semibold">Last Name:</span> {passenger.lastName}
            </div>
            <div className="detailItem">
              <span className="itemKey font-semibold">Date of Birth:</span> {}
              {passenger.dob ? new Date(passenger.dob).toLocaleDateString() : 'N/A'}
            </div>
            <div className="detailItem">
              <span className="itemKey font-semibold">Phone:</span> {passenger.phone}
            </div>
          </div>
          <div className="flex gap-4">
            <button
              className="bg-blue-500 text-white p-1 rounded-md"
              onClick={() => toggleEdit(index, true)}
            >
              Edit
            </button>
          </div>
        </div>
      ) : (
        // Edit Mode
        <div>
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
          </div>
          <div className="flex gap-4">
            <button
              className="bg-green-500 text-white p-1 rounded-md"
              onClick={() => saveChanges(index)}
            >
              Save Changes
            </button>
            <button
              className="bg-red-500 text-white p-1 rounded-md"
              onClick={() => removePassenger(index)}
            >
              Cancel
            </button>
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
        <h2 className="text-xl font-bold mb-4">Booking History</h2>
        <div className="py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Passengers</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{booking.from}</span>
                      <span className="text-sm text-gray-500">to</span>
                      <span>{booking.to}</span>
                    </div>
                  </TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={classColors[booking.class]}>
                      {booking.class}
                    </Badge>
                  </TableCell>
                  <TableCell>{booking.passengers}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusColors[booking.status]}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {booking.price}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserProfile;
