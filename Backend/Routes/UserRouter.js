import express from "express";
import {UserModel} from "../Models/User.js";
import cors from "cors";
import nodemailer from 'nodemailer';
import { SubscriberModel } from '../Models/Subscriber.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
const router = express.Router();
router.use(cors());
router.get('/user/:userId', (req, res) => {
  UserModel.findOne({ _id: req.params.userId })
      .then(user => {
          if (!user) {
              return res.status(404).json({ message: 'User not found' });
          }
          res.json(user);
      })
      .catch(err => {
          res.status(500).json({ message: err.message });
      });
});

router.get('/user',(req,res)=>{
  res.json({message:"user"})
});

// Update User Profile Data
router.put('/user/:userId', async (req, res) => {
    try {
        const user = await UserModel.findByIdAndUpdate(req.params.userId, req.body, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
});

//Update passengers data 
    router.put('/user/:userId/passengers', async (req, res) => {
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
router.delete('/user/:userId/:passengerId', async (req, res) => {
    const { userId, passengerId } = req.params;
    
    // First validate the passenger ID format
    if (!mongoose.Types.ObjectId.isValid(passengerId)) {
        return res.status(400).json({ message: 'Invalid passenger ID format' });
    }
    
    try {
        // Find the user by ID and remove the passenger
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        // Check if passenger exists
        const passengerIndex = user.passengers.findIndex(
            (passenger) => passenger._id.toString() === passengerId
        );
        if (passengerIndex === -1) {
            return res.status(404).json({ message: 'Passenger not found' });
        }
    
        // Remove passenger from the array
        user.passengers.splice(passengerIndex, 1);
        await user.save();
        
        res.status(200).json({ message: 'Passenger deleted successfully' });
    } catch (error) {
        console.error('Error deleting passenger:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
  
  
  // Route to get flight bookings for a specific user
  router.get('/user/:userId/bookings', async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Fetch the user data including bookings
      const user = await UserModel.findById(userId).populate('bookings'); // Assuming bookings is a populated reference
      // console.log(user);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user.bookings); // Send only the bookings
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
export default router;