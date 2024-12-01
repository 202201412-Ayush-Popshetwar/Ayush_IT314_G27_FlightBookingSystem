import {jest} from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { signup, login } from '../Controllers/AuthController.js';
import { UserModel } from '../Models/User.js';

let mongoServer;

describe('Auth Controller', () => {
    const mockRequest = (body = {}) => ({ body });
    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnThis();
        res.json = jest.fn().mockReturnThis();
        return res;
    };

    beforeAll(async () => {
        // Start in-memory MongoDB server
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
    });

    afterEach(async () => {
        // Clear the database after each test
        await UserModel.deleteMany();
    });

    afterAll(async () => {
        // Disconnect and stop the in-memory server
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    describe('signup', () => {
        it('should return 409 if user already exists', async () => {
            // Create a user directly in the database
            await UserModel.create({ name:'Test Data',email: 'test@example.com', password: 'hashedPassword' });

            const req = mockRequest({name:'Test Data', email: 'test@example.com', password: 'password' });
            const res = mockResponse();

            await signup(req, res);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User already exist, you can login',
                success: false,
            });
        });

        it('should return 200 on successful user creation', async () => {
            const req = mockRequest({name:'Test Data', email: 'new@example.com', password: 'password' });
            const res = mockResponse();

            await signup(req, res);

            const user = await UserModel.findOne({ email: 'new@example.com' });
            expect(user).not.toBeNull();
            expect(await bcrypt.compare('password', user.password)).toBe(true);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Signup successfully',
                success: true,
            });
        });

        it('should return 500 if an error occurs', async () => {
            // Simulate a database error by disconnecting
            await mongoose.disconnect();

            const req = mockRequest({name:'Test Data', email: 'test@example.com', password: 'password' });
            const res = mockResponse();

            await signup(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: expect.any(Error), // Error message may vary
                success: false,
            });

            // Reconnect to continue further tests
            await mongoose.connect(mongoServer.getUri(), {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        });
    });

    describe('login', () => {
        it('should return 403 if user does not exist', async () => {
            const req = mockRequest({ email: 'nonexistent@example.com', password: 'password' });
            const res = mockResponse();

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Auth failed email or password is wrong',
                success: false,
            });
        });

        it('should return 403 if password is incorrect', async () => {
            // Create a user in the database
            await UserModel.create({
                name:'Test Data',
                email: 'test@example.com',
                password: await bcrypt.hash('correctPassword', 10),
            });

            const req = mockRequest({ email: 'test@example.com', password: 'wrongPassword' });
            const res = mockResponse();

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Auth failed email or password is wrong',
                success: false,
            });
        });

        it('should return 200 and a JWT if login is successful', async () => {
            // Create a user in the database
            const user = await UserModel.create({
                email: 'test@example.com',
                password: await bcrypt.hash('password', 10),
                name: 'Test User',
            });

            const req = mockRequest({ email: 'test@example.com', password: 'password' });
            const res = mockResponse();

            await login(req, res);
            const token = res.json.mock.calls[0][0].jwtToken; // Extract the token.
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Login Success',
                success: true,
                jwtToken: token, // Check JWT exists
                email: user.email,
                name: user.name,
                userId: user._id,
            });
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT_SECRET

            // Validate the payload
            expect(decoded.email).toBe('test@example.com');
            expect(decoded._id).toBeDefined(); // Ensure the _id field exists
            expect(decoded).toHaveProperty('exp'); // Check the expiration field

        });

        it('should return 500 if an error occurs', async () => {
            // Simulate a database error by disconnecting
            await mongoose.disconnect();

            const req = mockRequest({ email: 'test@example.com', password: 'password' });
            const res = mockResponse();

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Internal server errror',
                success: false,
            });

            // Reconnect to continue further tests
            await mongoose.connect(mongoServer.getUri(), {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        });
    });
});
