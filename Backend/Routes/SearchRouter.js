import express from "express";

// This will help us connect to the database
import {db} from "../connection.js";

// This help convert the id from string to ObjectId for the _id.
import  {ObjectId} from "mongodb";
import AuthRouter from './AuthRouter.js';
import { FlightModel } from "../Models/User.js";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();
router.get('/ping', (req, res) => {
  res.send('PONG');
});

router.get('/flight/:id', async (req, res) => {
  try {
    const flightId = req.params.id;
    const flight = await FlightModel.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found", success: false });
    }
    res.status(200).json({ flight, success: true });
  } catch (err) {
    console.error("Error fetching flight:", err);
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

router.get('/flight', async (req, res) => {
  try {
    const { from, to, start_date } = req.query;

    // Build the query object
    const query = {};
    if (from) query.from = from;
    if (to) query.to = to;
    if (start_date) query['flight date'] = new String(start_date);

    const flights = await FlightModel.find(query);
    if (flights.length === 0) {
      return res.status(404).json({ message: "No flights found", success: false });
    }
    res.status(200).json({ flights, success: true });
  } catch (err) {
    console.error("Error fetching flights:", err);
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

router.get('/flights', async (req, res) => {
  try {
    const flights = await FlightModel.find();
    res.status(200).json({ flights, success: true });
  } catch (err) {
    console.error("Error fetching flights:", err);
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

//app.use('/products',ProductRouter);
router.use('/products',(req,res)=>{
  res.send({
      "message":"hey there"})
});

router.use('/checkout',(req,res)=>{
  res.send({
      "message":"checkout page"})
});
// This section will help you get a list of all the records.
router.get("/", async (req, res) => {
  let collection = await db.collection("Flights");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

//This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("Flights");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you create a new record.
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };
    let collection = await db.collection("Flights");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };

    let collection = await db.collection("Flights");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("Flights");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});


export default router;