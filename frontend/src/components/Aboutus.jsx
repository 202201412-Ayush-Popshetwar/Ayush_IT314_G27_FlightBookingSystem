import React, { useState } from 'react';
import Navbar from "./Navbar";
import Header from "./Header";
import Footer from "./Footer";

export default function AboutUs({ loggedInUser, setLoggedInUser }) {
    const [activeSection, setActiveSection] = useState("about");

    const teamMembers = [
        { name: "Raj Shah", id: "202201403" },
        { name: "Swapnil Shukla", id: "202201404" },
        { name: "Ayush Popshetwar", id: "202201412" },
        { name: "Harshvardhan Vajani", id: "202201413" },
        { name: "Manthan Parmar", id: "202201416" },
        { name: "Isha Bhanushali", id: "202201429" },
        { name: "Natansh Shah", id: "202201445" },
        { name: "Aditya Desai", id: "202201451" },
    ];

    return (
        <div className="flex flex-col min-h-screen" style={{ backgroundImage: "url('/flight.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <Navbar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
            <Header type="list" />

            {/* Styled Header Navigation */}
            <div className="bg-white bg-opacity-90 rounded-full shadow-lg p-2 my-6 mx-auto max-w-md flex justify-center space-x-8">
                <button
                    className={`py-2 px-4 rounded-full text-lg font-semibold ${activeSection === "about" ? "bg-blue-600 text-white" : "text-blue-600 hover:bg-blue-100"}`}
                    onClick={() => setActiveSection("about")}
                >
                    About
                </button>
                <button
                    className={`py-2 px-4 rounded-full text-lg font-semibold ${activeSection === "team" ? "bg-blue-600 text-white" : "text-blue-600 hover:bg-blue-100"}`}
                    onClick={() => setActiveSection("team")}
                >
                    Our Team
                </button>
                <button
                    className={`py-2 px-4 rounded-full text-lg font-semibold ${activeSection === "goals" ? "bg-blue-600 text-white" : "text-blue-600 hover:bg-blue-100"}`}
                    onClick={() => setActiveSection("goals")}
                >
                    Our Goals
                </button>
            </div>

            {/* Conditional Rendering of Sections */}
            {activeSection === "about" && (
                <div className="bg-gray-100 bg-opacity-90 rounded-lg p-8 shadow-xl max-w-7xl mx-auto my-12">
                    <h1 className="text-4xl font-extrabold text-center mb-12" style={{ color: "#003580", fontFamily: "'Poppins', sans-serif" }}>
                        About Us
                    </h1>
                    <p className="text-lg text-gray-700">
                      Welcome to SkyLynx, your trusted companion on the journey of exploration and discovery. 
                      At SkyLynx, we believe that travel is about more than just reaching a destination; 
                      it’s about connecting people, places, and experiences. Guided by our mission to 
                      <em>"Link Skies,"</em> we’re here to simplify your travel planning, so you can focus on 
                      what truly matters — creating memories.
                  </p>
                  <p className="text-lg text-gray-700 mt-4">
                      Whether you're chasing adventures across continents or reuniting with loved ones, 
                      SkyLynx is designed to make your journey seamless and stress-free. With thousands of 
                      routes at your fingertips and support available whenever you need it, we’re committed 
                      to getting you where you need to be, one flight at a time.
                  </p>
                  <p className="text-lg text-gray-700 mt-4">
                      Let’s explore the world together. <em>Welcome aboard!</em>
                  </p>

                </div>
            )}

            {activeSection === "team" && (
                <div className="bg-gray-100 bg-opacity-90 rounded-lg p-8 shadow-xl max-w-7xl mx-auto mb-12">
                    <h1 className="text-4xl font-extrabold text-center mb-12" style={{ color: "#003580", fontFamily: "'Poppins', sans-serif" }}>
                        Meet Our Team
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <div
                                key={index}
                                className="bg-white bg-opacity-90 rounded-lg shadow-md transform transition duration-300 hover:-translate-y-2 hover:shadow-xl p-6 flex flex-col items-center"
                            >
                                <div className="w-28 h-28 flex items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-blue-500 text-white font-bold text-3xl mb-4">
                                    {member.name.charAt(0)}
                                </div>
                                <h2 className="text-lg font-semibold mt-2" style={{ color: "#003580", fontFamily: "'Poppins', sans-serif" }}>
                                    {member.name}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">{member.id}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeSection === "goals" && (
                <div className="bg-gray-100 bg-opacity-90 rounded-lg p-8 shadow-xl max-w-7xl mx-auto my-12">
                    <h1 className="text-4xl font-extrabold text-center mb-12" style={{ color: "#003580" }}>
                        Our Goals
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <h3 className="text-2xl font-bold mb-4 text-blue-600">Customer Satisfaction</h3>
                            <p className="text-gray-700">Our primary goal is to ensure complete satisfaction with every booking and interaction.</p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <h3 className="text-2xl font-bold mb-4 text-blue-600">Reliability</h3>
                            <p className="text-gray-700">We aim to be your most reliable travel partner with accurate and dependable service.</p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <h3 className="text-2xl font-bold mb-4 text-blue-600">Innovation</h3>
                            <p className="text-gray-700">Continuously improving our platform with innovative solutions for better travel experiences.</p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <h3 className="text-2xl font-bold mb-4 text-blue-600">Best Prices</h3>
                            <p className="text-gray-700">Committed to offering competitive prices and exceptional value for your travels.</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-md mt-8">
                        <h3 className="text-2xl font-bold mb-4 text-blue-600">24/7 Support</h3>
                        <p className="text-gray-700">Round-the-clock assistance to support you throughout your journey.</p>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
