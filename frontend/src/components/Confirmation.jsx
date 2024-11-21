import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';

import Navbar from "./Navbar";
import Header from "./Header";
import Footer from "./Footer";

const ConfirmationPage = ({ loggedInUser , setLoggedInUser  }) => {
    
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
        doc.setFontSize(20);
        doc.text('Flight Ticket', 20, 20);
        doc.setFontSize(12);
        doc.text('Thank you for booking with us!', 20, 30);

        // Draw a line
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);

        // Flight details
        doc.setFontSize(14);
        doc.text(`Flight Number: ${flightDetails.flightNumber}`, 20, 50);
        doc.text(`Departure: ${flightDetails.departure}`, 20, 60);
        doc.text(`Arrival: ${flightDetails.arrival}`, 20, 70);
        doc.text(`Date: ${flightDetails.date}`, 20, 80);
        doc.text(`Departure Time: ${flightDetails.departureTime}`, 20, 90);
        doc.text(`Arrival Time: ${flightDetails.arrivalTime}`, 20, 100);

        // Passenger details
        doc.text(`Passenger Name: ${passengerDetails.name}`, 20, 120);
        doc.text(`Seat: ${passengerDetails.seat}`, 20, 130);
        doc.text(`Class: ${passengerDetails.class}`, 20, 140);

        // Total amount
        doc.setFontSize(16);
        doc.text(`Total Amount: ₹${passengerDetails.totalAmount}`, 20, 160);

        // Footer
        doc.setFontSize(14);
        doc.text('Enjoy your flight!', 20, 180);

        // Save the PDF
        doc.save('flight_ticket.pdf');
    };
    const flightDetails = {
        flightNumber: 'XYZ123',
        departure: 'New York (JFK)',
        arrival: 'Los Angeles (LAX)',
        date: '20th Dec 2024',
        departureTime: '09:00 AM',
        arrivalTime: '03:15 PM'
    };
    
    const passengerDetails = {
        name: 'John Doe',
        seat: '23A',
        class: 'Economy',
        totalAmount: '30,000'
    };
    return (
        <div className="flex flex-col min-h-screen" style={{ backgroundImage: "url('/flight.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <Navbar loggedInUser ={loggedInUser } setLoggedInUser ={setLoggedInUser } />
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