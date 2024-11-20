import express from 'express';
const router = express.Router();
import { UserModel, FlightModel, BookingModel } from '../Models/User.js';

// Create a new booking
router.post('/create', async (req, res) => {
    try {
        const {
            userId,
            flightId,
            from,
            to,
            date,
            class: flightClass,
            passengers,
            status,
            price,
            paymentMethod,
            addons
        } = req.body;

        // First verify if user exists
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Verify flight exists and has available seats
        const flight = await FlightModel.findById(flightId);
        if (!flight) {
            return res.status(404).json({ 
                success: false, 
                message: 'Flight not found' 
            });
        }

        if (flight.availableseats < passengers.length) {
            return res.status(400).json({ 
                success: false, 
                message: 'Not enough seats available' 
            });
        }

        // Create new booking using BookingModel
        const newBooking = new BookingModel({
            userId,
            flightId,
            from,
            to,
            date,
            class: flightClass,
            passengers,
            status,
            price,
            paymentMethod,
            addons,
            createdAt: new Date()
        });

        // Save the booking
        const savedBooking = await newBooking.save();

        // Add booking reference to user's bookings array
        user.bookings.push(savedBooking._id);
        await user.save();

        // Update flight's available seats
        flight.availableseats -= passengers.length;
        await flight.save();

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking: savedBooking
        });

    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
});

export default router;