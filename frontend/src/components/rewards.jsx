import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { FlightTakeoff, CheckCircle, CardTravel, Work } from "@mui/icons-material"; // Updated icons
import Header from "./Header";

const RewardsPage = () => {
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [totalPoints, setTotalPoints] = useState(1250); // Starting points
  const [redeemAmount, setRedeemAmount] = useState(0); // Points redeemed

  const handleRedeem = () => {
    const pointsToRedeem = totalPoints; // Redeem all available points
    if (totalPoints > 0) {
      setTotalPoints(0); // Reset total points to 0 after redemption
      setRedeemAmount(pointsToRedeem); // Store the redeemed amount
      setRedeemSuccess(true); // Show success message

      // Hide the success message after 1.5 seconds
      setTimeout(() => {
        setRedeemSuccess(false);
        setRedeemAmount(0); // Reset redeem amount
      }, 1500);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100"
      style={{
        backgroundImage: "url('/flight.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
        
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <header className="bg-white bg-opacity-30 backdrop-blur-sm p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-blue-800">Your Rewards</h1>
          <p className="text-sm text-gray-700 mt-2">
            Earn points and unlock exciting benefits!
          </p>
        </header>

        {/* Reward Summary */}
        <section className="bg-white bg-opacity-30 backdrop-blur-sm p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-blue-800">Reward Summary</h2>
          <div className="flex items-center justify-between mt-6">
            <div>
              <p className="text-gray-500">Total Points</p>
              <p className="text-4xl font-bold text-blue-800">{totalPoints}</p>
            </div>
            <button
              className="px-6 py-2 bg-blue-600 text-white text-lg rounded-lg shadow hover:bg-blue-700 active:scale-95 transform transition-all duration-150"
              onClick={handleRedeem}
            >
              Redeem Now
            </button>
          </div>

          {/* Success Pop-up */}
          {redeemSuccess && (
            <div className="fixed inset-0 flex items-center justify-center z-50 transition-opacity opacity-100 animate-opacity-appear">
              <div className="bg-green-500 text-white px-8 py-4 rounded-lg shadow-xl transform transition-all duration-500 scale-110 opacity-100">
                <CheckCircle className="text-white text-3xl" /> {/* CheckCircle icon for success */}
                <span>{redeemAmount} points redeemed successfully!</span>
              </div>
            </div>
          )}
        </section>

        {/* Benefits Section */}
        <section className="bg-white bg-opacity-30 backdrop-blur-sm p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-blue-800">Why Earn Rewards?</h2>
          <ul className="mt-6 space-y-6">
            <li className="flex items-start space-x-6">
              <span className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl">
                <FlightTakeoff /> {/* Plane taking off icon */}
              </span>
              <p className="text-gray-700 ">
                Earn points for every booking you make.
              </p>
            </li>
            <li className="flex items-start space-x-6">
              <span className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl">
                <CardTravel /> {/* Travel icon for redeeming points */}
              </span>
              <p className="text-gray-700">
                Redeem points for discounts on flights and other perks.
              </p>
            </li>
            <li className="flex items-start space-x-6">
              <span className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl">
                <Work /> {/* Work icon for loyalty benefits */}
              </span>
              <p className="text-gray-700">
                Enjoy exclusive benefits as a loyal customer.
              </p>
            </li>
          </ul>
        </section>

        {/* Offers Section */}
        <section className="bg-white bg-opacity-30 backdrop-blur-sm p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-blue-800">Exclusive Offers</h2>
          <div className="mt-6 flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-6">
            <div className="flex-1 bg-blue-50 bg-opacity-30 p-5 rounded-lg shadow">
              <h3 className="text-blue-700 font-bold text-lg">
                10% Off on Next Flight
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Use 500 points to avail this offer.
              </p>
            </div>
            <div className="flex-1 bg-blue-50 bg-opacity-30 p-5 rounded-lg shadow">
              <h3 className="text-blue-700 font-bold text-lg">
                Free Lounge Access
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Use 1,000 points to unlock.
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default RewardsPage;
