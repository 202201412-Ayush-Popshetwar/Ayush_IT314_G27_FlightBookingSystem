import express from 'express';
const app = express();
import bodyParser from 'body-parser';
import cors from 'cors';
import AuthRouter from './Routes/AuthRouter.js';
import UserRouter from './Routes/UserRouter.js';
import dotenv from 'dotenv';
import './connection.js';
import {UserModel,BookingModel,FlightModel,AirportModel} from './Models/User.js';
import {db} from "./connection.js";
import  {ObjectId} from "mongodb";
import SearchRouter from './Routes/SearchRouter.js';
import bookingRouter from './Routes/bookingRouter.js';


 const PORT = process.env.PORT || 5050;
 dotenv.config()
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());



app.use("/auth",AuthRouter);
app.use("/search", SearchRouter);
app.use(UserRouter);
app.use('/bookings', bookingRouter);



app.listen(PORT,()=>{
    console.log("Connected to Backend")})