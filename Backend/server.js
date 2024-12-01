import app from './index.js'; // Assume your Express app instance is in app.js

function startServer() {
    const PORT = process.env.PORT;

    if (!PORT) {
        throw new Error("Invalid port");
    }

    app.listen(PORT, () => {
        console.log(`Connected to Backend on port ${PORT}`);
    });

    return app; // Useful for testing
}
startServer();
export { startServer };
