import express from 'express';
const app = express();
import bodyParser from 'body-parser';
import cors from 'cors';
import AuthRouter from './Routes/AuthRouter.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import './Models/db.js';
import records from "./Routes/record.js";
//import ProductRouter from './Routes/ProductRouter';
 const PORT = process.env.PORT || 5050;
 dotenv.config()
app.use(cors());
app.use(express.json());
app.use("/record", records);
app.use("/auth",AuthRouter);
app.use(bodyParser.json());

//----------------------New code-------------------------

const connect = async() =>{
    try 
    {
        await mongoose.connect(String(process.env.ATLAS_URI));
        console.log("Connected to MongoDB")
    } 
    catch (error) 
    {
        throw error;
    }
}
mongoose.connection.on("Disconnected",()=>{console.log("MongoDB Disconnected")})
mongoose.connection.on("Connected",()=>{console.log("MongoDB Connected")})


app.get("/" , (req,res)=>{
    res.send("hello first request")
})

app.listen(PORT,()=>{
    connect()
    console.log("Connected to Backend")})