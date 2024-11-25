import { MongoClient, ServerApiVersion } from "mongodb";
import mongoose from 'mongoose';
import dotenv from "dotenv";
import cors from 'cors';
import express from 'express';
const app = express();
dotenv.config();

const uri = process.env.ATLAS_URI;

// MongoDB Node.js driver setup
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
app.use(cors());
export async function connectToDatabase() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("Error connecting to MongoDB");
    throw err;
  }

  // Connect to the specific database
  const db = client.db("Flight-Ticket-Booking-System");

  return db;
}

// Mongoose setup
export const connectMongoose = async () => {
        try 
        {
            await mongoose.connect(String(uri));
            console.log("Connected to MongoDB")

        } 
        catch (error) 
        {

          console.error("Error connecting to MongoDB");
          throw(error)
          
        }
        
};

mongoose.connection.on("Disconnected",()=>{console.log("Mongoose connection disconnected")})
mongoose.connection.on("Connected",()=>{console.log("Mongoose connection established")})

// Initialize connections
const db = await connectToDatabase();
await connectMongoose();


export { db, mongoose };