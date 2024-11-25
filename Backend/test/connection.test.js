import {jest} from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectToDatabase, connectMongoose } from '../connection.js';
describe('Database Connection', () => {
    let mongoserver,consoleSpy;
    beforeAll(async () => {
        // Start in-memory MongoDB server
        const mongoServer = await MongoMemoryServer.create({
        binary: {
            version: '5.0.0', // Match the version downloaded
            downloadDir: './mongodb-binaries', // Path to cached binaries
        },
        });
        
        process.env.ATLAS_URI = mongoServer.getUri();
    });
    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });
    afterAll(async () => {
        // Stop the in-memory server
        if(mongoserver){
            await mongoServer.stop();
        }
        await mongoose.disconnect();
    });

    afterEach(async () => {
        // Disconnect Mongoose after each test
        await mongoose.disconnect();
    });

    describe('connectToDatabase', () => {
        it('should connect to MongoDB and confirm connection with ping', async () => {
            const consoleSpy = jest.spyOn(console, 'log');

            await connectToDatabase();

            expect(consoleSpy).toHaveBeenCalledWith(
                'Pinged your deployment. You successfully connected to MongoDB!'
            );

            consoleSpy.mockRestore();
        });
    });

    describe('connectMongoose', () => {
        it('should successfully connect using mongoose', async () => {
            const consoleSpy = jest.spyOn(console, 'log');

            await connectMongoose();

            expect(consoleSpy).toHaveBeenCalledWith('Connected to MongoDB');

            consoleSpy.mockRestore();
        });

        it('should handle mongoose connection events', async () => {
            const connection = mongoose.connection;

            const connectedSpy = jest.spyOn(console, 'log');
            const disconnectedSpy = jest.spyOn(console, 'log');

            await connectMongoose();

            connection.emit('Connected');
            connection.emit('Disconnected');

            expect(connectedSpy).toHaveBeenCalledWith('Mongoose connection established');
            expect(disconnectedSpy).toHaveBeenCalledWith('Mongoose connection disconnected');

            connectedSpy.mockRestore();
            disconnectedSpy.mockRestore();
        });
    });
    describe('connectMongoose', () => {
        it('should throw an error when mongoose connection fails', async () => {
            process.env.ATLAS_URI = 'invalid-uri'
            const error = new Error('Failed to connect');
            jest.spyOn(mongoose, 'connect').mockRejectedValueOnce(error);

            await expect(connectMongoose()).rejects.toThrow(error);;

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('Error connecting to MongoDB')
            );
        });
    });
    describe('connectToDatabase', () => {
        it('should throw an error when mongodb connection fails', async () => {
            process.env.ATLAS_URI = 'invalid-uri'
            const error = new Error('Failed to connect');
            jest.spyOn(console, 'log')
            await connectToDatabase();

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('Error connecting to MongoDB')
            );
            consoleSpy.mockRestore();
        });
    });
});
