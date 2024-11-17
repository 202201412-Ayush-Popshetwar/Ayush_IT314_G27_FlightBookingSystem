import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-[#003580] text-white py-[5vh] w-full mt-0">
            <div className="max-w-[1024px] mx-auto px-[5vw]">
                <div className="flex flex-wrap justify-between items mb-[4vh]">
                    <div className="footer-section about w-full sm:w-1/3 mb-4">
                        <h2 className="text-xl font-bold mb-2t">FlightBookingSystem</h2>
                        <p>Your one-stop solution for booking flights with ease and convenience.</p>
                    </div>
                    <div className="footer-section-links w-full sm:w-1/3 mb-4">
                        <h2 className="text-xl font-bold mb-2">Quick Links</h2>
                        <ul>
                            <li><a href="/" className="text-white hover text-gray-100 hover:underline">Home</a></li>
                            <li><a href="/about" className="text-white hover text-gray-100 hover:underline">About Us</a></li>
                            <li><a href="/contact" className="text-white hover text-gray-100 hover:underline">Contact Us</a></li>
                            <li><a href="/faq" className="text-white hover text-gray-100 hover:underline">FAQ</a></li>
                        </ul>
                    </div>
                    <div className="footer-section-contact w-full sm:w-1/3 mb-4">
                        <h2 className="text-xl font-bold mb-2">Contact Us</h2>
                        <p>Email: <a href="mailto:support@flightbookingsystem.com" className="hover:underline">support@flightbookingsystem.com</a></p>
                        <p>Phone: +123 456 7890</p>
                    </div>
                </div>
                <div className="footer-bottom text-center text-sm">
                    &copy; {new Date().getFullYear()} FlightBookingSystem | All Rights Reserved
                </div>
            </div>
        </footer>
    );
};

export default Footer;