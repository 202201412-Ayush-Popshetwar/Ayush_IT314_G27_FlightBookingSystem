import {jest} from '@jest/globals'
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import supertest from "supertest";
import express from "express";
import { FlightModel } from "../Models/User.js"; // Adjust path to your FlightModel
import router from "../Routes/SearchRouter.js"; // Adjust path to the router file

const app = express();
app.use(express.json());
app.use(router);

let mongoServer,flightId1,flightId2;

beforeAll(async () => {
    await mongoose.connection.close();
  // Start in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create(
    { binary: {
        version: '5.0.0', // Match the version downloaded
        downloadDir: './mongodb-binaries' // Path to cached binaries
    }}
  );
  const uri = mongoServer.getUri();

  // Connect mongoose to the in-memory MongoDB
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Disconnect and stop the server
//   await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear existing data before each test
  if (flightId1) {
    await FlightModel.deleteOne({ _id: flightId1 });
}
if (flightId2) {
    await FlightModel.deleteOne({ _id: flightId2 });
}
});

describe("/flight endpoint", () => {
  it("should return 404 if no flights match the query", async () => {
    const response = await supertest(app).get("/flight").query({
      from: "NYC",
      to: "LAC",
      start_date: "2023-06-26",
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "No flights found",
      success: false,
    });
  });

  it("should return 200 and matching flights when flights exist", async () => {
    // Add test data
    const flight1 = await FlightModel.create({
        'flight date': "2023-06-26",
        airline : "SpiceJet",
        flight_num: "SG-9001",
        class : "economy",
        from : "NYC",
        dep_time : "18:55",
        to : "LAX",
        arr_time : "21:05",
        duration : "04h 10m",
        price : "6,013",
        stops : "non-stop",
        availableseats: 100
    });
    const flight2 = await FlightModel.create({
        'flight date': "2023-06-26",
        airline : "SpiceJet",
        flight_num: "SG-9002",
        class : "economy",
        from : "NYC",
        dep_time : "18:55",
        to : "LAX",
        arr_time : "21:05",
        duration : "04h 10m",
        price : "6,013",
        stops : "non-stop",
        availableseats: 100
    });
    flightId1 = flight1._id.toString();
    flightId2 = flight2._id.toString();
    const response = await supertest(app).get("/flight").query({
      from: "NYC",
      to: "LAX",
      start_date: "2023-06-26",
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.flights).toHaveLength(2);
    expect(response.body.flights[0]).toMatchObject({
      from: "NYC",
      to: "LAX",
      "flight date": "2023-06-26",
    });
  });

  it("should return all flights when no query parameters are provided", async () => {
    // Add test data
    const flight = await FlightModel.create({
        'flight date': "2023-06-26",
        airline : "SpiceJet",
        flight_num: "SG-9001",
        class : "economy",
        from : "NYC",
        dep_time : "18:55",
        to : "LAX",
        arr_time : "21:05",
        duration : "04h 10m",
        price : "6,013",
        stops : "non-stop",
        availableseats: 100
    });
    flightId1 = flight._id.toString();

    const response = await supertest(app).get("/flight");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.flights).toHaveLength(1);
  });

  it("should return 500 if there is a server error", async () => {
    // Simulate server error by overriding the FlightModel find method
    jest.spyOn(FlightModel, "find").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const response = await supertest(app).get("/flight").query({
      from: "NYC",
      to: "LAX",
      start_date: "2023-06-26",
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Internal server error",
      success: false,
    });
  });
});
