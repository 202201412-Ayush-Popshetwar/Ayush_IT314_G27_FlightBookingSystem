import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from "./Navbar";
const PaymentPage = ({ loggedInUser}) => {
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        postalCode: ''
    });
    const navigate = useNavigate(); // hook to handle navigation

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle card number formatting
        if (name === 'cardNumber') {
            let formattedValue = value.replace(/\D/g, ''); // Remove non-numeric characters

            // If the value exceeds 16 digits, limit it to 16
            if (formattedValue.length > 16) {
                formattedValue = formattedValue.slice(0, 16);
            }

            // Add space after every 4 digits
            formattedValue = formattedValue.replace(/(\d{4})(?=\d)/g, '$1 ');

            setFormData({ ...formData, [name]: formattedValue });
        } else if (name === 'expiryDate') {
            // Handle expiry date formatting (MM/YY)
            let formattedValue = value.replace(/\D/g, ''); // Remove non-numeric characters
            if (formattedValue.length > 2) {
                formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4); // Add '/' after month
            }
            setFormData({ ...formData, [name]: formattedValue });
        } else if (name === 'cvv') {
            // Allow only 3 digits for CVV
            if (/^\d{0,3}$/.test(value)) {
                setFormData({ ...formData, [name]: value });
            }
        } else {
            // For other fields, update normally
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate card number length (16 digits after removing spaces)
        if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
            alert('Please provide a valid card number with 16 digits.');
            return;
        }

        // Validate CVV length (3 digits)
        if (formData.cvv.length !== 3) {
            alert('CVV must be exactly 3 digits.');
            return;
        }

        // Validate expiry date format (MM/YY)
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!expiryRegex.test(formData.expiryDate)) {
            alert('Please enter a valid expiry date in MM/YY format.');
            return;
        }

        // If all validations pass, proceed with payment
        console.log('Payment submitted:', formData);
        alert('Payment submitted successfully (dummy)!');

        // Navigate to the next page (can be a confirmation page)
        navigate('/confirmation');
    };

    return (
        <div>
        <Navbar loggedInUser={loggedInUser} />
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
            <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg">
                
                {/* Left Column: Payment Details */}
                <div className="w-full md:w-1/2 p-6 space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Details</h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-600 mb-1">Credit Card Number</label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                maxLength="19" // Max length 19 to accommodate spaces
                                placeholder='Enter Card Number'
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
                                    placeholder='MM/YY'
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
                                    placeholder='CVV'
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
                                placeholder='XXXXXX'
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded focus:outline-none transition duration-150 ease-in-out"
                        >
                            Complete Payment
                        </button>
                    </form>

                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/booking')} // Navigate to booking page
                        className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded focus:outline-none transition duration-150 ease-in-out"
                    >
                        Back To Booking
                    </button>
                </div>

                {/* Right Column: Flight Summary */}
                <div className="w-full md:w-1/2 p-6 border-l">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Flight Summary</h2>
                    
                    <div className="mb-4">
                        <p className="text-lg text-gray-700 font-medium">Flight Number: <span className="text-gray-900 font-semibold">XYZ123</span></p>
                        <p className="text-sm text-gray-600">Non-stop | Duration: 6h 15m</p>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-700 mb-1">Departure</h3>
                        <p className="text-gray-800">New York (JFK)</p>
                        <p className="text-sm text-gray-600">20th Dec 2024, 09:00 AM</p>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-700 mb-1">Arrival</h3>
                        <p className="text-gray-800">Los Angeles (LAX)</p>
                        <p className="text-sm text-gray-600">20th Dec 2024, 03:15 PM</p>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center font-semibold text-lg pt-4">
                            <span>Total Amount</span>
                            <span>₹30,000</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default PaymentPage;
