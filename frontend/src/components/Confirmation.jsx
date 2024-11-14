import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';

import Navbar from "./Navbar";
const ConfirmationPage = ({ loggedInUser}) => {
    const [isTickVisible, setIsTickVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Delay to trigger the animation of the tick mark
        setTimeout(() => {
            setIsTickVisible(true);
        }, 500);
    }, []);

    const generatePDF = () => {
        const doc = new jsPDF();

        // Add content for the flight ticket PDF
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(16);
        doc.text('Flight Ticket', 20, 20);
        doc.setFontSize(12);
        doc.text('Thank you for booking with us!', 20, 30);

        doc.text(`Flight Number: XYZ123`, 20, 50);
        doc.text(`Departure: New York (JFK)`, 20, 60);
        doc.text(`Arrival: Los Angeles (LAX)`, 20, 70);
        doc.text(`Date: 20th Dec 2024`, 20, 80);
        doc.text(`Departure Time: 09:00 AM`, 20, 90);
        doc.text(`Arrival Time: 03:15 PM`, 20, 100);

        doc.text(`Passenger Name: John Doe`, 20, 120);
        doc.text(`Seat: 23A`, 20, 130);
        doc.text(`Class: Economy`, 20, 140);

        doc.text(`Total Amount: ₹30,000`, 20, 160);
        doc.setFontSize(14);
        doc.text('Enjoy your flight!', 20, 170);

        doc.save('flight_ticket.pdf');
    };

    return (
        <div><Navbar loggedInUser={loggedInUser} />
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
            <div className="flex flex-col items-center justify-center w-full max-w-md bg-white rounded-lg shadow-lg p-8">
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
                            className={`transition-all duration-1000 ease-in-out ${isTickVisible ? 'stroke-dasharray-[60] stroke-dashoffset-0' : 'stroke-dasharray-[60] stroke-dashoffset-[60]'}`}
                            style={{
                                strokeDasharray: 60,
                                strokeDashoffset: isTickVisible ? 0 : 60,
                            }}
                        />
                    </svg>
                </div>

                {/* Confirmation Text */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Successful!</h2>
                <p className="text-lg text-gray-600 mb-6">Your booking has been confirmed. You can now download your flight ticket.</p>

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
        </div>
    );
};

export default ConfirmationPage;
