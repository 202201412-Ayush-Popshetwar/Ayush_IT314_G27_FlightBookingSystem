import React, { useState } from 'react';
import Navbar from './Navbar'; 
import Badge from './ui/Badge'; 
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

const UserProfile = ({loggedInUser}) => {
  const [username, setUsername] = useState('Jane Doe');
  const [email, setEmail] = useState('janedoe@gmail.com');
  const [phoneNumber, setPhoneNumber] = useState('+1 2345 67 89');
  const [address, setAddress] = useState('Elton St. 234 Garden Yd. New York');
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({ username, email, phoneNumber, address });

  const [passengers, setPassengers] = useState([{ designation: '', firstName: '', lastName: '', dob: '', phone: '' }]);

  const handlePassengerChange = (index, event) => {
    const newPassengers = passengers.map((passenger, i) => {
      if (i === index) {
        return { ...passenger, [event.target.name]: event.target.value };
      }
      return passenger;
    });
    setPassengers(newPassengers);
  };

  const addPassenger = () => {
    if (passengers.length < 4) {
      setPassengers([...passengers, { designation: '', firstName: '', lastName: '', dob: '', phone: '' }]);
    }
  };

  const removePassenger = (index) => {
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  const handleEdit = () => {
    if (isEditing) {
      // Save changes
      setOriginalData({ username, email, phoneNumber, address });
      // Add database update logic here
    } else {
      // Start editing
      setOriginalData({ username, email , phoneNumber, address });
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setUsername(originalData.username);
    setEmail(originalData.email);
    setPhoneNumber(originalData.phoneNumber);
    setAddress(originalData.address);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col">
      <Navbar loggedInUser={loggedInUser} />
      <div className="p-4 bg-white shadow-md rounded-lg mt-4 max-w-7xl mx-auto">
        {/* User Information Section */}
        <h1 className="text-xl font-bold mb-4">User  Profile</h1>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="detailItem">
            <span className="itemKey font-semibold">Username:</span>
            {isEditing ? (
              <input
                className="ml-2 border border-gray-300 rounded-md p-1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            ) : (
              <span className="itemValue">{username}</span>
            )}
          </div>
          <div className="detailItem">
            <span className="itemKey font-semibold">Email:</span>
            {isEditing ? (
              <input
                className="ml-2 border border-gray-300 rounded-md p-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            ) : (
              <span className="itemValue">{email}</span>
            )}
          </div>
          <div className="detailItem">
            <span className="itemKey font-semibold">Phone Number:</span>
            {isEditing ? (
              <input
                className="ml-2 border border-gray-300 rounded-md p-1"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            ) : (
              <span className="itemValue">{phoneNumber}</span>
            )}
          </div>
          <div className="detailItem">
            <span className="itemKey font-semibold">Address:</span>
            {isEditing ? (
              <input
                className="ml-2 border border-gray-300 rounded-md p-1"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            ) : (
              <span className="itemValue">{address}</span>
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
                <div className="detailItem flex items-center">
                  <button
                    className="bg-red-500 text-white p-1 rounded-md"
                    onClick={() => removePassenger(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          {passengers.length < 4 && (
            <button className="bg-blue-500 text-white p-2 rounded-md" onClick={addPassenger}>
              Add Passenger
            </button>
          )}
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
    </div>
  );
};

export default UserProfile;