import React from 'react';
import './index.css'; 

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section about">
                    <h2>FlightBookingSystem</h2>
                    <p>Your one-stop solution for booking flights with ease and convenience.</p>
                </div>
                <div className="footer-section-links">
                    <h2>Quick Links</h2>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/about">About Us</a></li>
                        <li><a href="/contact">Contact Us</a></li>
                        <li><a href="/faq">FAQ</a></li>
                    </ul>
                </div>
                <div className="footer-section-contact">
                    <h2>Contact Us</h2>
                    <p>Email: support@flightbookingsystem.com</p>
                    <p>Phone: +123 456 7890</p>
                </div>
            </div>
            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} FlightBookingSystem | All Rights Reserved
            </div>
        </footer>
    );
};

export default Footer;