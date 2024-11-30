import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import Header from "./Header";
import Footer from "./Footer";
import axios from 'axios';
import { handleError } from '../utils';

const PaymentPage = ({ loggedInUser, setLoggedInUser }) => {
    
    const [selectedPayment, setSelectedPayment] = useState('card');
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        upiId: '',
        postalCode: ''
    });
    const navigate = useNavigate();

    // Get all necessary details from localStorage
    const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails'));
    const passengerDetails = JSON.parse(localStorage.getItem('passengerDetails'));
    const addonDetails = JSON.parse(localStorage.getItem('addonDetails') || '[]');
    const totalPrice = localStorage.getItem('totalPrice');
    const searchParams = JSON.parse(localStorage.getItem('searchParams'));

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'cardNumber') {
            const formatted = value.replace(/\D/g, '')
                .slice(0, 16)
                .replace(/(\d{4})(?=\d)/g, '$1 ');
            setFormData({ ...formData, [name]: formatted });
        } else if (name === 'expiryDate') {
            let formatted = value.replace(/\D/g, '');
            if (formatted.length > 2) {
                formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4);
            }
            setFormData({ ...formData, [name]: formatted });
        } else if (name === 'cvv') {
            const formatted = value.replace(/\D/g, '').slice(0, 3);
            setFormData({ ...formData, [name]: formatted });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Payment validation checks
        if (selectedPayment === 'card') {
            if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
                handleError('Please provide a valid card number with 16 digits.');
                return;
            }
            if (formData.cvv.length !== 3) {
                handleError('CVV must be exactly 3 digits.');
                return;
            }
            const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
            if (!expiryRegex.test(formData.expiryDate)) {
                handleError('Please enter a valid expiry date in MM/YY format.');
                return;
            }

            // Add expiry date validation
            const [expiryMonth, expiryYear] = formData.expiryDate.split('/');
            const expiryDate = new Date(2000 + parseInt(expiryYear), parseInt(expiryMonth) - 1);
            const flightDate = new Date(bookingDetails.date[0].startDate);
            
            if (expiryDate < flightDate) {
                handleError('Invalid card expiry date');
                return;
            }
        } else if (selectedPayment === 'upi') {
            const upiRegex = /^[a-zA-Z0-9.-]+@[a-zA-Z]+$/;
            if (!upiRegex.test(formData.upiId)) {
                handleError('Please enter a valid UPI ID (e.g., user123@bank).');
                return;
            }
        }

        try {
            // Prepare booking data
            const bookingData = {
                userId: localStorage.getItem('userId'),
                flightId: bookingDetails.flight._id,
                from: bookingDetails.flight.from,
                to: bookingDetails.flight.to,
                date: new Date(bookingDetails.date[0].startDate),
                class: bookingDetails.flight.class,
                passengers: passengerDetails.map(passenger => ({
                    designation: passenger.designation,
                    firstName: passenger.firstName,
                    lastName: passenger.lastName,
                    dob: new Date(passenger.dob),
                })),
                status: "Confirmed",
                price: Number(totalPrice),
                paymentMethod: selectedPayment,
                addons: addonDetails
            };

            // Make API call to create booking
            const token = localStorage.getItem('token');
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/bookings/create`, 
                bookingData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                alert('Booking confirmed successfully!');
                navigate('/confirmation');
            }
        } catch (error) {
            handleError(error.response?.data?.message || 'Error processing payment');
        }
    };

    const renderPaymentForm = () => {
        switch (selectedPayment) {
            case 'card':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-600 mb-1">Credit Card Number</label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                placeholder="Enter Card Number"
                                maxLength="19"
                                required
                            />
                        </div>

                        <div className="flex space-x-4">
                            <div className="w-1/2">
                                <label className="block text-gray-600 mb-1">Expiring MM/YY</label>
                                <input
                                    type="text"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                    placeholder="MM/YY"
                                    required
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-gray-600 mb-1">CVV Code</label>
                                <input
                                    type="text"
                                    name="cvv"
                                    value={formData.cvv}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                    placeholder="CVV"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-600 mb-1">Postal Code</label>
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                placeholder="XXXXXX"
                                required
                            />
                        </div>
                    </div>
                );
            case 'upi':
                return (
                    <div>
                        <label className="block text-gray-600 mb-1">UPI ID</label>
                        <input
                            type="text"
                            name="upiId"
                            value={formData.upiId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            placeholder="username@upi"
                            required
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col min-h-screen" style={{ backgroundImage: "url('/flight.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <Navbar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
            <Header type="list" />
            <div className="flex items-center justify-center min-h-screen p-6">
                <div className="flex flex-col md:flex-row w-10/12  bg-white rounded-lg shadow-lg">
                    {/* Left Column: Payment Details */}
                    <div className="w-full md:w-1/2 p-6 space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Details</h3>
                        
                        {/* Payment Method Selection */}
                        <div className="mb-6">
                            <h4 className="text-lg font-medium text-gray-700 mb-4">Select Payment Method</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    className={`p-4 border rounded-lg flex flex-col items-center ${
                                        selectedPayment === 'card' ? 'border-blue-500 bg-blue-50' : ''
                                    }`}
                                    onClick={() => setSelectedPayment('card')}
                                >
                                    <span className="text-2xl mb-2">💳</span>
                                    <span className="text-sm">Card</span>
                                </button>
                                <button
                                    type="button"
                                    className={`p-4 border rounded-lg flex flex-col items-center ${
                                        selectedPayment === 'upi' ? 'border-blue-500 bg-blue-50' : ''
                                    }`}
                                    onClick={() => setSelectedPayment('upi')}
                                >
                                    <span className="text-2xl mb-2">📱</span>
                                    <span className="text-sm">UPI</span>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {renderPaymentForm()}

                            <button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded focus:outline-none transition duration-150 ease-in-out"
                            >
                                Complete Payment
                            </button>
                        </form>

                        {/* Back Button */}
                        <button
                            onClick={() => navigate('/Addon')}
                            className="w-full mt-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded focus:outline-none transition duration-150 ease-in-out"
                        >
                            Back To Add Ons
                        </button>
                    </div>

                    {/* Right Column: Flight Summary */}
                    <div className="w-full md:w-1/2 p-6 border-l">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Flight Summary</h2>
                        
                        <div className="mb-4">
                            <p className="text-lg text-gray-700 font-medium">
                                Flight Number: <span className="text-gray-900 font-semibold">{bookingDetails.flight.flight_num}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                                {bookingDetails.flight.stops} | Duration: {bookingDetails.flight.duration}
                            </p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-700 mb-1">Departure</h3>
                            <p className="text-gray-800">{bookingDetails.flight.from}</p>
                            <p className="text-sm text-gray-600">
                                {new Date(bookingDetails.date[0].startDate).toLocaleDateString()}, {bookingDetails.flight.dep_time}
                            </p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-700 mb-1">Arrival</h3>
                            <p className="text-gray-800">{bookingDetails.flight.to}</p>
                            <p className="text-sm text-gray-600">
                                {new Date(bookingDetails.date[0].startDate).toLocaleDateString()}, {bookingDetails.flight.arr_time}
                            </p>
                        </div>

                        <div className="border-t pt-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Base Fare ({searchParams.options.adult} Adults, {searchParams.options.children} Children)
                                    </span>
                                    <span>₹{bookingDetails.basePrice}</span>
                                </div>

                                {/* Display addon details if any */}
                                {addonDetails.map((addon, index) => (
                                    <div key={index} className="flex justify-between">
                                        <span className="text-gray-600">
                                            {addon.name} ({addon.variety}) x{addon.quantity}
                                        </span>
                                        <span>₹{addon.price}</span>
                                    </div>
                                ))}

                                {/* Display passenger details */}
                                <div className="pt-2 border-t">
                                    <h4 className="text-gray-700 font-medium mb-2">Passenger Details:</h4>
                                    {passengerDetails.map((passenger, index) => (
                                        <p key={index} className="text-sm text-gray-600">
                                            {passenger.designation} {passenger.firstName} {passenger.lastName}
                                        </p>
                                    ))}
                                </div>

                                <div className="flex justify-between font-medium text-lg pt-2 border-t">
                                    <span>Total Amount</span>
                                    <span>₹{totalPrice}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PaymentPage;