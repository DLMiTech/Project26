import express from 'express';
import {config} from 'dotenv';
import {connectDB, disconnectDB} from './config/db.js';

//import routes
import movieRoutes from './routes/movieRoutes.js';


config();
connectDB();


//the app
const app = express();

//API Routes
app.use('/movies', movieRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})



//Handel unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error("Unhandled Rejection: " + err);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
})

//Handle uncaught exception
process.on('uncaughtException', async (err) => {
    console.error("Uncaught Exception: " + err);
    await disconnectDB();
    process.exit(1);
})

//Graceful shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
})