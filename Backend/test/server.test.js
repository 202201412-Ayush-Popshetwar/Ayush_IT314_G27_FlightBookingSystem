import { startServer } from '../server.js'; // Import your startServer function
import http from 'http'; // To manually start and stop the server
import { jest } from '@jest/globals';

// Mock console.log to verify log messages
jest.spyOn(console, 'log').mockImplementation(() => {});

describe("Server Initialization", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("Should throw an error if PORT is not defined", () => {
        delete process.env.PORT; // Simulate missing PORT
        expect(() => startServer()).toThrow("Invalid port");
    });

    test("Should start server successfully on a valid port", (done) => {
        process.env.PORT = "3000"; // Simulate a valid port

        // Start the server manually
        startServer();

        // We need to set a timeout because it takes some time for the server to start
        setTimeout(() => {
            expect(console.log).toHaveBeenCalledWith("Connected to Backend on port 3000");
            done(); // End the test
        }, 100); // Wait for a short time to allow the server to start
    });

    test("Should throw an error if trying to start the server with an invalid port", (done) => {
        process.env.PORT = "INVALID_PORT"; // Simulate invalid port

        // We need to check the error log in case of failure
        const server = http.createServer(startServer);

        server.on('error', (err) => {
            expect(err.code).toBe('EACCES'); // Check for permission error or invalid port
            done(); // End the test
        });

        server.listen(process.env.PORT); // Attempt to start server with invalid port
    });
});
