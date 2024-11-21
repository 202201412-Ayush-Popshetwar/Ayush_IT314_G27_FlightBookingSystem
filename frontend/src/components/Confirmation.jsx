import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';

import Navbar from "./Navbar";
import Header from "./Header";
import Footer from "./Footer";

const ConfirmationPage = ({ loggedInUser, setLoggedInUser }) => {
    const [isTickVisible, setIsTickVisible] = useState(false);
    const navigate = useNavigate();

    // Fetch details from localStorage
    const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails')) || {};
    const passengerDetails = JSON.parse(localStorage.getItem('passengerDetails')) || [];
    const addonDetails = JSON.parse(localStorage.getItem('addonDetails') || '[]');
    const totalPrice = localStorage.getItem('totalPrice') || '0';

    useEffect(() => {
        // Delay to trigger the animation of the tick mark
        setTimeout(() => {
            setIsTickVisible(true);
        }, 500);
    }, []);

    const generatePDF = () => {
        const doc = new jsPDF();
    
        // Title
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(22);
        doc.text('Flight Ticket', 105, 20, null, null, 'center');
    
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(12);
        doc.text('Thank you for booking with us!', 105, 30, null, null, 'center');
    
        // Draw a line
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);
    
        // Flight Details Section
        doc.setFontSize(14);
        doc.setFont('Helvetica', 'bold');
        doc.text('Flight Details:', 20, 45);
    
        doc.setFont('Helvetica', 'normal');
        const flightDetailsY = 55;
        // Setting the flight number to start from 1
        const flightNumber = 1; // Hardcoded flight number starting from 1
        doc.text(`Flight Number: ${flightNumber}`, 20, flightDetailsY);
        doc.text(`Departure: ${bookingDetails.flight?.from || 'N/A'}`, 20, flightDetailsY + 10);
        doc.text(`Arrival: ${bookingDetails.flight?.to || 'N/A'}`, 20, flightDetailsY + 20);
        doc.text(
            `Date: ${new Date(bookingDetails.date?.[0]?.startDate || '').toLocaleDateString() || 'N/A'}`,
            20,
            flightDetailsY + 30
        );
        doc.text(`Departure Time: ${bookingDetails.flight?.dep_time || 'N/A'}`, 20, flightDetailsY + 40);
        doc.text(`Arrival Time: ${bookingDetails.flight?.arr_time || 'N/A'}`, 20, flightDetailsY + 50);
    
        // Passenger Details Section
        doc.setFont('Helvetica', 'bold');
        doc.text('Passenger Details:', 20, flightDetailsY + 70);
    
        doc.setFont('Helvetica', 'normal');
        let passengerDetailsY = flightDetailsY + 80;
        passengerDetails.forEach((passenger, index) => {
            doc.text(
                `Passenger ${index + 1}: ${passenger.designation} ${passenger.firstName} ${passenger.lastName}`,
                20,
                passengerDetailsY
            );
            passengerDetailsY += 10;
        });
    
        // Add-on Details Section
        if (addonDetails.length > 0) {
            doc.setFont('Helvetica', 'bold');
            doc.text('Add-ons:', 20, passengerDetailsY + 10);
    
            doc.setFont('Helvetica', 'normal');
            addonDetails.forEach((addon, index) => {
                doc.text(
                    `Addon ${index + 1}: ${addon.name} - ₹${addon.price}`,
                    20,
                    passengerDetailsY + 20 + index * 10
                );
            });
            passengerDetailsY += 20 + addonDetails.length * 10;
        }
    
        // Total Amount Section
        doc.setFont('Helvetica', 'bold');
        doc.text(`Total Amount: ₹${totalPrice}`, 20, passengerDetailsY + 20);
    
        // Footer
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(14);
        doc.text('Enjoy your flight!', 105, 280, null, null, 'center');
    
        // Save the PDF
        doc.save('flight_ticket.pdf');
    };
    
    return (
        <div
            className="flex flex-col min-h-screen"
            style={{
                backgroundImage: "url('/flight.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <Navbar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
            <Header type="list" />
            <div className="flex items-center justify-center flex-grow p-20">
                <div className="flex flex-col items-center justify-center w-full max-w-md bg-white rounded-lg shadow-lg p-8 bg-opacity-90">
                    {/* Tick mark animation */}
                    <div className="relative mb-6">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100"
                            height="100"
                            viewBox="0 0 100 100"
                            className="text-green-500"
                        >
                            <circle
                                cx="50"
                                cy="50"
                                r="48"
                                fill="none"
                                stroke="#4CAF50"
                                strokeWidth="4"
                            />
                            {/* Animated Tick */}
                            <path
                                d="M30 50 L45 65 L70 35"
                                fill="none"
                                stroke="#4CAF50"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{
                                    strokeDasharray: 60,
                                    strokeDashoffset: isTickVisible ? 0 : 60,
                                    transition: 'stroke-dashoffset 1s ease-in-out',
                                }}
                            />
                        </svg>
                    </div>

                    {/* Confirmation Text */}
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Successful!</h2>
                    <p className=" text-lg text-gray-600 mb-6">Your booking has been confirmed. You can now download your flight ticket.</p>

                    {/* Generate PDF button */}
                    <button
                        onClick={generatePDF}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded focus:outline-none transition duration-150 ease-in-out"
                    >
                        Download Flight Ticket
                    </button>

                    {/* Back to Home Button */}
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded focus:outline-none transition duration-150 ease-in-out"
                    >
                        Back To Home
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ConfirmationPage;
