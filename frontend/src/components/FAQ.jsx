import React, { useState } from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import Footer from "./Footer";

const FAQ = ({ loggedInUser , setLoggedInUser  }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        { 
            question: "What is SkyLynx and how does it work?", 
            answer: "SkyLynx is your ultimate travel companion, designed to simplify the process of searching and booking flights, hotels, and other travel services. With a user-friendly interface, you can easily compare prices, read reviews, and make bookings in just a few clicks." 
        },
        { 
            question: "Where can I find your terms of use and privacy policy?", 
            answer: "You can find our terms of use and privacy policy in the 'Legal' section on our website. We encourage all users to review these documents to understand their rights and responsibilities." 
        },
        { 
            question: "Is there a mobile app for SkyLynx?", 
            answer: "Yes! SkyLynx offers a mobile app available for download on both the App Store and Google Play Store. Manage your bookings, receive notifications, and explore travel options on the go!" 
        },
        { 
            question: "What sets SkyLynx apart from other travel platforms?", 
            answer: "SkyLynx stands out by offering personalized travel recommendations based on your preferences, providing real-time updates, and ensuring competitive pricing, all aimed at enhancing your booking experience." 
        },
        { 
            question: "What should I do if my question isn't listed here?", 
            answer: "If you have additional questions or need further assistance, please reach out to our support team via email or live chat. We're here to help!" 
        },
        { 
            question: "How can I contact SkyLynx customer support?", 
            answer: "You can contact our customer support team through our support page. We offer multiple channels, including chat, email, and phone support, to assist you promptly." 
        },
        { 
            question: "How do I track my refund status?", 
            answer: "To track your refund status, simply log into your account and navigate to the 'Refunds' section in your dashboard for real-time updates." 
        },
        { 
            question: "What is the process for canceling my ticket?", 
            answer: "To cancel your ticket, log into your account, go to the bookings section, and select 'Cancel' next to the relevant booking. Follow the prompts to complete the cancellation." 
        },
        { 
            question: "How do I request a refund for my booking?", 
            answer: "To request a refund, go to the 'Refunds' section of your account, follow the provided instructions, and submit your refund request. We'll process it as quickly as possible." 
        },
        { 
            question: "Can you explain your Customer Grievance Redressal policy?", 
            answer: "Our Customer Grievance Redressal policy ensures that all grievances are addressed promptly and efficiently. You can reach out to our dedicated support team for any issues, and we will escalate them as needed." 
        },
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="flex flex-col min-h-screen" style={{ backgroundImage: "url('/flight.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <Navbar loggedInUser  ={loggedInUser  } setLoggedInUser  ={setLoggedInUser  } />
            <Header type="list" />
            <div className="max-w-[1000px] mx-auto p-5 font-sans">
                <div className="bg-white  p-5 rounded-lg shadow-lg mb-6">
                    <h2 className="text-3xl text-blue-800 text-center mb-4 font-bold">About SkyLynx</h2>
                    <p className="text-center text-gray-700 text-base">
                        Welcome to our FAQ section! Here you'll find answers to common questions about SkyLynx. If you need further assistance, please don't hesitate to reach out to our support team.
                    </p>
                </div>

                <div className="border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-gray-300 last:border-b-0">
                            <div 
                                className="flex justify-between items-center p-4 bg-gray-100 cursor-pointer hover:bg-gray-200 transition duration-200"
                                onClick={() => toggleFAQ(index)}
                            >
                                <span className="text-gray-800 font-semibold">{faq.question}</span>
                                <span className="text-blue-500 text-2xl">{activeIndex === index ? "-" : "+"}</span>
                            </div>
                            {activeIndex === index && (
                                <div className="p-4 bg-white text-gray-600 text-sm">{faq.answer}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default FAQ;