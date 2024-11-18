import express from 'express';
const app = express();
import bodyParser from 'body-parser';
import cors from 'cors';
import AuthRouter from './Routes/AuthRouter.js';
import dotenv from 'dotenv';
import './connection.js';
import {UserModel,BookingModel,FlightModel,AirportModel} from './Models/User.js';
import {db} from "./connection.js";
import  {ObjectId} from "mongodb";
import SearchRouter from './Routes/SearchRouter.js';


 const PORT = process.env.PORT || 5050;
 dotenv.config()
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

async function populateAirportsFromBookings() {
  try {
    // Fetch distinct 'from' values from bookings
    const distinctFromLocations = await FlightModel.distinct("from");

    // Prepare data for bulk insert, ensuring no duplicates
    const airportData = distinctFromLocations.map((location) => ({ name: location }));

    // Insert data into Airport collection
    await AirportModel.insertMany(airportData, { ordered: false });
    console.log("Airports added successfully!");
  } catch (error) {
    if (error.code === 11000) {
      console.log("Duplicate entry encountered. Ignoring duplicates.");
    } else {
      console.error("Error inserting airports:", error);
    }
  }
}

// Usage
populateAirportsFromBookings();

app.use("/auth",AuthRouter);
app.use("/search", SearchRouter);

  // Fetch user profile
  app.get('/user/:userId', async (req, res) => {
    try {
      const user = await UserModel.findOne({ _id: req.params.userId });
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Update User Profile Data
  app.put('/user/:userId', async (req, res) => {
    try {
      const user = await UserModel.findByIdAndUpdate(req.params.userId, req.body, { new: true });
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

app.put('/user/:userId/passengers', async (req, res) => {
  const { userId } = req.params;
  const { passengers } = req.body;

  try {
    // Update the passengers array for the user
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { passengers },
      { new: true } 
    );

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating passengers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete a passenger
app.delete('/user/:userId/:passengerId', async (req, res) => {
  const { userId, passengerId } = req.params;
  
  try {
    // Find the user by ID and remove the passenger
    const user = await UserModel.findById(userId);
    // console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if passenger exists
    const passengerIndex = user.passengers.findIndex(
      (passenger) => passenger._id.toString() === passengerId
    );
    // console.log(user.passengers[passengerIndex]);
    if (passengerIndex === -1) {
      return res.status(404).json({ message: 'Passenger not found' });
    }

    // Remove passenger from the array
    user.passengers.splice(passengerIndex, 1);
   

    // Save the updated user document
    await user.save();
    
    res.status(200).json({ message: 'Passenger deleted successfully' });
  } catch (error) {
    console.error('Error deleting passenger:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Route to get flight bookings for a specific user
app.get('/user/:userId/bookings', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the user data including bookings
    const user = await UserModel.findById(userId).populate('bookings'); // Assuming `bookings` is a populated reference
    // console.log(user);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.bookings); // Send only the bookings
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.listen(PORT,()=>{
    console.log("Connected to Backend")})