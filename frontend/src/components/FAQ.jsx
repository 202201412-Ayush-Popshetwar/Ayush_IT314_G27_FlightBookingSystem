import React, { useState } from "react";
import "./FAQ.css";
import Navbar from "./Navbar";

const FAQ = ({ loggedInUser,setLoggedInUser }) => {
    const [activeIndex, setActiveIndex] = useState(null);
    
    const faqs = [
        { question: "What is skylynx?", answer: "Skylynx is a travel search and booking platform that helps users plan and book their trips efficiently." },
        { question: "What are your terms of use and privacy policy? Where can I read more about it?", answer: "You can read about our terms of use and privacy policy on our website under the 'Legal' section." },
        { question: "How can I know about skylynx mobile apps?", answer: "You can download the skylynx mobile app from the App Store or Google Play Store to manage your bookings on the go." },
        { question: "Why is skylynx different from other travel booking platforms?", answer: "Skylynx offers personalized travel recommendations, real-time updates, and competitive prices to make your booking experience seamless." },
        { question: "What if I cannot find my question on this list?", answer: "If you cannot find your question, feel free to contact our support team via email or live chat for assistance." },
        { question: "How do I contact skylynx customer care?", answer: "You can contact skylynx customer care through our support page, where you can reach us via chat, email, or phone." },
        { question: "How can I track refunds on skylynx?", answer: "You can track your refund status by logging into your account and visiting the 'Refunds' section in your dashboard." },
        { question: "How do I cancel my ticket on skylynx?", answer: "To cancel your ticket, go to the bookings section in your account and select 'Cancel' next to your booking." },
        { question: "How do I get a refund on a ticket booking through skylynx?", answer: "To get a refund, go to the 'Refunds' section of your account, follow the instructions, and submit a refund request." },
        { question: "What is your Customer Grievance Redressal policy?", answer: "Our policy ensures that all grievances are addressed promptly through our dedicated support team and escalation process." },
    ];


    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="faq-background">
            <Navbar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>
        <div className="faq-container">
            <h2>About SkyLynx</h2>
            <p className="faq-p">
                Here's a compilation of all the travel queries you may have. We’re pretty sure the answer to your
                question will be here. Just in case you don't see it, please use contact us option mentioned below 
                and we will get back to you for resolution.
            </p>

            <div className="faq-list">
                {faqs.map((faq, index) => (
                    <div key={index} className="faq-item">
                        <div 
                            className="faq-question" 
                            onClick={() => toggleFAQ(index)}
                        >
                            {faq.question}
                            <span>{activeIndex === index ? "-" : "+"}</span>
                        </div>
                        {activeIndex === index && (
                            <div className="faq-answer">{faq.answer}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};

export default FAQ;
