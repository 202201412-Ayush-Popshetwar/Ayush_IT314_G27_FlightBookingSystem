import {jest} from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcrypt';
import { UserModel } from '../Models/User.js';
import { Booking } from '../Controllers/BookingController.js';

let mongoServer,user;

describe('Booking Controller - Booking function', () => {
    const mockRequest = (body = {}) => ({ body });
    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnThis();
        res.json = jest.fn().mockReturnThis();
        return res;
    };

    beforeAll(async () => {
        // Start the in-memory MongoDB server
        mongoServer = await MongoMemoryServer.create(
            { binary: {
                version: '5.0.0', // Match the version downloaded
                downloadDir: './mongodb-binaries' // Path to cached binaries
            }}
        );
        const uri = mongoServer.getUri();

        // Connect to the in-memory database
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterEach(async () => {
        // Clean up the database after each test
    if (user) {
        await UserModel.deleteOne({ _id: user });
    }
    // Clean up any bookings related to the user
    if (user) {
        await BookingModel.deleteMany({ userId: user });
    }
    });

    afterAll(async () => {
        // Disconnect and stop the in-memory server
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    describe('Booking (Signup)', () => {
        it('should return 409 if user already exists', async () => {
            // Create a user in the database before testing
            const existingUser = new UserModel({
                name: 'Test User',
                email: 'test@example.com',
                password: await bcrypt.hash('password', 10),
            });
            await existingUser.save();

            const req = mockRequest({
                name: 'New User',
                email: 'test@example.com',
                password: 'password',
            });
            const res = mockResponse();

            // Call the Booking function
            await Booking(req, res);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User already exist, you can login',
                success: false,
            });
        });

        it('should return 201 and create a new user', async () => {
            const req = mockRequest({
                name: 'New User',
                email: 'new@example.com',
                password: 'password',
            });
            const res = mockResponse();

            // Call the Booking function
            await Booking(req, res);

            // Find the user in the database
            const user = await UserModel.findOne({ email: 'new@example.com' });

            expect(user).not.toBeNull();
            expect(await bcrypt.compare('password', user.password)).toBe(true); // Check hashed password

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Signup successfully',
                success: true,
            });
        });

        it('should return 500 if an error occurs', async () => {
            // Simulate a database error by disconnecting before making the request
            await mongoose.disconnect();

            const req = mockRequest({
                name: 'New User',
                email: 'error@example.com',
                password: 'password',
            });
            const res = mockResponse();

            // Call the Booking function
            await Booking(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: expect.any(Error), // Error message will vary
                success: false,
            });

            // Reconnect to continue further tests
            const uri = mongoServer.getUri();
            await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        });

        it('should hash the password correctly before saving the user', async () => {
            const req = mockRequest({
                name: 'Hash Test User',
                email: 'hash@example.com',
                password: 'password123',
            });
            const res = mockResponse();

            // Call the Booking function
            await Booking(req, res);

            // Retrieve the created user
            const user = await UserModel.findOne({ email: 'hash@example.com' });

            // Ensure the password is hashed and not stored in plain text
            expect(user).not.toBeNull();
            expect(await bcrypt.compare('password123', user.password)).toBe(true); // Password should match the hashed value
        });
    });
});
