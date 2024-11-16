import express from 'express';
const app = express();
import bodyParser from 'body-parser';
import cors from 'cors';
import AuthRouter from './Routes/AuthRouter.js';
import dotenv from 'dotenv';
import './connection.js';
import records from "./Routes/record.js";
import {UserModel} from './Models/User.js';

 const PORT = process.env.PORT || 5050;
 dotenv.config()
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());



app.use("/record", records);
app.use("/auth",AuthRouter);

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
app.listen(PORT,()=>{
    console.log("Connected to Backend")})