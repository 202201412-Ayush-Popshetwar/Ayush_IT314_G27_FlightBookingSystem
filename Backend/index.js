import express from 'express';
const app = express();
import bodyParser from 'body-parser';
import cors from 'cors';
import AuthRouter from './Routes/AuthRouter.js';
import dotenv from 'dotenv';
import './connection.js';
import records from "./Routes/record.js";
 const PORT = process.env.PORT || 5050;
 dotenv.config()
app.use(cors());
app.use(express.json());
app.use("/record", records);
app.use("/auth",AuthRouter);
app.use(bodyParser.json());


app.get("/" , (req,res)=>{
    res.send("hello first request")
})

app.listen(PORT,()=>{
    console.log("Connected to Backend")})