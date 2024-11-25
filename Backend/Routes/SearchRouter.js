import express from "express";
import AuthRouter from './AuthRouter.js';
import { FlightModel } from "../Models/User.js";

const router = express.Router();


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




// // This section will help you create a new record.
// router.post("/", async (req, res) => {
//   try {
//     let newDocument = {
//       name: req.body.name,
//       position: req.body.position,
//       level: req.body.level,
//     };
//     let collection = await db.collection("Flights");
//     let result = await collection.insertOne(newDocument);
//     res.send(result).status(204);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error adding record");
//   }
// });

// // This section will help you update a record by id.
// router.patch("/:id", async (req, res) => {
//   try {
//     const query = { _id: new ObjectId(req.params.id) };
//     const updates = {
//       $set: {
//         name: req.body.name,
//         position: req.body.position,
//         level: req.body.level,
//       },
//     };

//     let collection = await db.collection("Flights");
//     let result = await collection.updateOne(query, updates);
//     res.send(result).status(200);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error updating record");
//   }
// });

// // This section will help you delete a record
// router.delete("/:id", async (req, res) => {
//   try {
//     const query = { _id: new ObjectId(req.params.id) };

//     const collection = db.collection("Flights");
//     let result = await collection.deleteOne(query);

//     res.send(result).status(200);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error deleting record");
//   }
// });


export default router;