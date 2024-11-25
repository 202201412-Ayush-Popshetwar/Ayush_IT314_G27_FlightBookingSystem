import {jest} from '@jest/globals';
import request from 'supertest';
import app from '../index.js'; // Import the app for testing
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UserModel, FlightModel, BookingModel } from '../Models/User.js'; // Import relevant models

let mongoServer,flightId;

beforeAll(async () => {
    await mongoose.disconnect();
    // Start MongoMemoryServer
    mongoServer = await MongoMemoryServer.create(
        {
            binary: {
                version: '5.0.0', // Match the version downloaded
                downloadDir: './mongodb-binaries', // Path to cached binaries
            },
            }
    );
    const uri = mongoServer.getUri();

    // // Connect to in-memory MongoDB
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});
afterEach(async () => {

    if (flightId) {
        await FlightModel.deleteOne({ _id: flightId });
    }
    // Clear database between tests
    await UserModel.deleteMany();
    await BookingModel.deleteMany();
});

afterAll(async () => {
    // Disconnect and stop MongoMemoryServer
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Index.js Unit Tests with MongoMemoryServer', () => {
    describe('GET /', () => {
        it('should return status 200 and message "OK"', async () => {
            const res = await request(app).get('/');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({});
            expect(res.text).toBe('OK');
        });
    });

    describe('Routes Testing', () => {
        describe('Auth Routes (/auth)', () => {
            it('should handle POST /auth/signup', async () => {
                const res = await request(app)
                    .post('/auth/signup')
                    .send({ name: 'Test User', email: 'test@example.com', password: 'password' });
                expect([201, 400, 409]).toContain(res.status);
            });

            it('should handle POST /auth/login', async () => {
                // Seed a user for login
                await UserModel.create({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'hashedpassword123',
                });

                const res = await request(app)
                    .post('/auth/login')
                    .send({ email: 'test@example.com', password: 'password' });
                expect([200, 400, 401,403]).toContain(res.status);
            });
        });

        describe('Search Routes (/search)', () => {
            it('should handle GET /search/flight with valid query params', async () => {
                // Seed flight data
                await FlightModel.create({
                        'flight date' :"26-06-2023",  
                        airline: 'SpiceJet',
                        flight_num: 'SG-9000',
                        from: 'NYC',
                        to: 'LAX',
                        dep_time: '18:55',
                        arr_time: '21:05',
                        duration:"04h 10m",
                        class: "economy",
                        price: 6000,
                        stops:'non-stop'
                });

                const res = await request(app)
                    .get('/search/flight')
                    .query({ from: 'NYC', to: 'SFO', start_date: '2024-11-25' });

                expect([200, 404]).toContain(res.status);
                if (res.status === 200) {
                    expect(res.body).toHaveProperty('flights');
                    expect(Array.isArray(res.body.flights)).toBeTruthy();
                } else {
                    expect(res.body.message).toBe('No flights found');
                }
            });
        });

        describe('Booking Routes (/bookings)', () => {
            it('should handle POST /bookings/create for creating a booking', async () => {
                // Seed user and flight data
                const user = await UserModel.create({
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                    password: 'hashedpassword123',
                });

                const flight = await FlightModel.create({
                    'flight date' :"26-06-2023",  
                    airline: 'SpiceJet',
                    flight_num: 'SG-9000',
                    from: 'NYC',
                    to: 'LAX',
                    dep_time: '18:55',
                    arr_time: '21:05',
                    duration:"04h 10m",
                    class: "economy",
                    price: 6000,
                    stops:'non-stop'
                });

                const res = await request(app)
                    .post('/bookings/create')
                    .send({
                        userId: user._id.toString(),
                        flightId: flight._id.toString(),
                        from: 'NYC',
                        to: 'LAX',
                        date: '2023-06-26T00:00:00.000+00:00',
                        class: 'business',
                        passengers: [{ firstName: 'John', lastName: 'Doe', dob: '1990-01-01' }],
                        status: 'Confirmed',
                        price: 6000,
                        paymentMethod: 'card',
                        addons: [],
                    });

                expect([201, 400, 404, 500]).toContain(res.status);
                if (res.status === 201) {
                    expect(res.body).toHaveProperty('booking');
                    expect(res.body.message).toBe('Booking created successfully');
                }
            });
        });
    });

    describe('Middleware Validation', () => {
        it('should validate CORS headers', async () => {
            const res = await request(app).get('/');
            expect(res.status).toBe(200);
            expect(res.headers['access-control-allow-origin']).toBe('*');
        });

        it('should parse JSON with express.json()', async () => {
            const res = await request(app)
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .send({ key: 'value' });
            expect([200, 400]).toContain(res.status);
        });
    });

    describe('Environment Variables', () => {
        it('should load environment variables', () => {
            expect(process.env.PORT).toBeDefined();
            expect(process.env.PORT).toBe('5050');
        });
    });
    describe('Undefined Routes', () => {
        it('should return 404 for undefined routes', async () => {
            const res = await request(app).get('/undefined-route');
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Not Found');
        });
    });

});
