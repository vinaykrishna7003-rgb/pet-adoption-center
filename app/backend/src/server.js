import app from "./app.js";
import { PORT } from "./config/env.js";
import { testConnection } from "./database/connection.js";

process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err);
    process.exit(1); //mandatory (as per the Node.js docs)
});

const startServer = async () => {
    try {
        await testConnection();
        app.listen(PORT, () => {
            console.log('Server started on port: ', PORT);
            console.log(`📍 API available at http://localhost:${PORT}/api/v1`);
            console.log(`🏥 Health check at http://localhost:${PORT}/api/v1/health`);
        });
    } catch (err) {
        console.log('Server failed to start: ', err);
        process.exit(1);
    }
}

startServer();

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
    // Application specific logging, throwing an error, or other logic here
});