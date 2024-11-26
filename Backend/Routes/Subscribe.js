import express from 'express';
import nodemailer from 'nodemailer';
import { SubscriberModel } from '../Models/Subscriber.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.use(cors());

router.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    // Check if email already exists
    const existingSubscriber = await SubscriberModel.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already subscribed' 
      });
    }

    // Configure nodemailer transporter with more detailed settings
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to SkyLynx Newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #003580;">Welcome to SkyLynx! ✈️</h1>
          <p>Thank you for subscribing to our newsletter!</p>
          <p>You'll now receive:</p>
          <ul>
            <li>Exclusive flight deals</li>
            <li>Travel tips and guides</li>
            <li>Special promotions</li>
            <li>Latest travel updates</li>
          </ul>
          <p>Stay tuned for our next update!</p>
        </div>
      `
    };

    // Save to database first
    const newSubscriber = new SubscriberModel({ email });
    await newSubscriber.save();
    
    // Send welcome email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      success: true, 
      message: 'Successfully subscribed! Please check your email for confirmation.' 
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to subscribe. Please try again later.' 
    });
  }
});

export default router; 
