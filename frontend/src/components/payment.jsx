import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import Header from "./Header";
import Footer from "./Footer";

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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedPayment === 'card') {
            // Validate card number length
            if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
                alert('Please provide a valid card number with 16 digits.');
                return;
            }

            // Validate CVV length
            if (formData.cvv.length !== 3) {
                alert('CVV must be exactly 3 digits.');
                return;
            }

            // Validate expiry date format
            const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
            if (!expiryRegex.test(formData.expiryDate)) {
                alert('Please enter a valid expiry date in MM/YY format.');
                return;
            }
        } else if (selectedPayment === 'upi') {
            // Validate UPI ID format
            const upiRegex = /^[\w.-]+@[\w.-]+$/;
            if (!upiRegex.test(formData.upiId)) {
                alert('Please enter a valid UPI ID.');
                return;
            }
        }

        // If all validations pass
        console.log('Payment submitted:', formData);
        alert('Payment submitted successfully!');
        navigate('/confirmation');
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
                            <p className="text-lg text-gray-700 font-medium">Flight Number: <span className="text-gray-900 font-semibold">G9419</span></p>
                            <p className="text-sm text-gray-600">Non-stop | Duration: 1h 35m</p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-700 mb-1">Departure</h3>
                            <p className="text-gray-800">Ahmedabad</p>
                            <p className="text-sm text-gray-600">22-11-2024, 05:05</p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-700 mb-1">Arrival</h3>
                            <p className="text-gray-800">Sharjah</p>
                            <p className="text-sm text-gray-600">22-11-2024, 06:35</p>
                        </div>

                        <div className="border-t pt-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Base Fare (3 Adults, 1 Child)</span>
                                    <span>AED 44.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Airport Tax & Surcharge</span>
                                    <span>AED 2,256.44</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Additional Services</span>
                                    <span>AED 127.50</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Service Tax</span>
                                    <span>AED 162.90</span>
                                </div>
                                <div className="flex justify-between font-medium text-lg pt-2 border-t">
                                    <span>Total Amount</span>
                                    <span>AED 2,606.66</span>
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