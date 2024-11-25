import {jest} from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../index.js'; // Assuming your Express app is in app.js or index.js
import { UserModel, FlightModel, BookingModel } from '../Models/User.js';

// Set up MongoMemoryServer
let mongoServer;
let userId;
let flightId;

beforeAll(async () => {
    await mongoose.disconnect();
    mongoServer = await MongoMemoryServer.create(
        { binary: {
            version: '5.0.0', // Match the version downloaded
            downloadDir: './mongodb-binaries' // Path to cached binaries
        }}
    );
    const uri = mongoServer.getUri();
    
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // Create a user and a flight in the in-memory database
    const user = await UserModel.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'hashedpassword123',
    });
    userId = user._id.toString();

    const flight = await FlightModel.create({
        'flight date': "26-06-2023",
        airline : "SpiceJet",
        flight_num: "SG-9000",
        class : "economy",
        from : "NYC",
        dep_time : "18:55",
        to : "LAX",
        arr_time : "21:05",
        duration : "04h 10m",
        price : "6,013",
        stops : "non-stop",
        availableseats: 100});
    flightId = flight._id.toString();
});

afterEach(async () => {
    // Clean up the database after each test
    if (userId) {
        await UserModel.deleteOne({ _id: userId });
    }

    // Clean up any bookings related to the user
    if (userId) {
        await BookingModel.deleteMany({ userId: userId });
    }

    // Clean up any flights related to the specific flightId
    if (flightId) {
        await FlightModel.deleteOne({ _id: flightId });
    }
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Booking Router', () => {

    // Test Case 1: Create a booking successfully
    it('should create a booking successfully if user and flight exist', async () => {
        const bookingData = {
            userId,
            flightId,
            from: 'NYC',
            to: 'LAX',
            date: '2023-06-26',
            class: 'economy',
            passengers: [{ name: 'John Doe' }],
            status: 'Confirmed',
            price: 6013,
            paymentMethod: 'card',
            addons: [],
        };

        const response = await request(app)
            .post('/bookings/create')
            .send(bookingData);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Booking created successfully');
        expect(response.body.booking).toHaveProperty('_id');
        expect(response.body.booking.passengers.length).toBe(1);
    });

    // Test Case 2: Return 404 if the user does not exist
    it('should return 404 if user does not exist', async () => {
        const bookingData = {
            userId : new mongoose.Types.ObjectId().toString(),
            flightId,
            from: 'NYC',
            to: 'LAX',
            date: '2023-06-23',
            class: 'economy',
            passengers: [{ name: 'John Doe' }],
            status: 'Confirmed',
            price: 6013,
            paymentMethod: 'card',
            addons: [],
        };

        const response = await request(app)
            .post('/bookings/create')
            .send(bookingData);

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('User not found');
    });

    // Test Case 3: Return 404 if the flight does not exist
    it('should return 404 if flight does not exist', async () => {
        const user = await UserModel.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'hashedpassword123',
        });
        userId = user._id.toString();
        const bookingData = {
            userId ,
            flightId : new mongoose.Types.ObjectId().toString(),
            from: 'NYC',
            to: 'LAX',
            date: '2023-06-26',
            class: 'economy',
            passengers: [{ name: 'John Doe' }],
            status: 'Confirmed',
            price: 6013,
            paymentMethod: 'card',
            addons: [],
        };
        const response = await request(app)
            .post('/bookings/create')
            .send(bookingData);

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Flight not found');
    });

    // Test Case 4: Return 400 if not enough seats are available
    it('should return 400 if there are not enough seats available', async () => {
        const user = await UserModel.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'hashedpassword123',
        });
        userId = user._id.toString();
        const flight = await FlightModel.create({
            'flight date': "26-06-2023",
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
        flightId = flight._id.toString();
          
        const bookingData = {
            userId ,
            flightId,
            from: 'NYC',
            to: 'LAX',
            date: '2023-06-26',
            class: 'economy',
            passengers: new Array(101).fill({ name: 'John Doe'}), // 101 passengers, but only 50 seats
            status: 'Confirmed',
            price: 6013,
            paymentMethod: 'card',
            addons: [],
        };
        const response = await request(app)
            .post('/bookings/create')
            .send(bookingData);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Not enough seats available');
    });

    // Test Case 5: Return 500 if there's an internal server error
    it('should return 500 if there is a server error', async () => {
        // Disconnect the database to simulate a server error
        await mongoose.disconnect();

        const bookingData = {
            userId,
            flightId,
            from: 'NYC',
            to: 'LAX',
            date: '2023-06-23',
            class: 'economy',
            passengers: [{ name: 'John Doe' }],
            status: 'Confirmed',
            price: 6013,
            paymentMethod: 'card',
            addons: [],
        };

        const response = await request(app)
            .post('/bookings/create')
            .send(bookingData);

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Error creating booking');
        
        // Reconnect to continue further tests
        await mongoose.connect(mongoServer.getUri(), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });
});
