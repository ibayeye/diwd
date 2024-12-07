import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRouter from './routes/auth/authRouter.js'
import deviceRouter from './routes/device/deviceRouter.js'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import config from './config/config.js';
import database from './config/firebase.js'
import Pengguna from './models/pengguna.js';

dotenv.config()

const app = express();


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors());


// routing
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/', deviceRouter);

//middleware error
app.use(notFound);
app.use(errorHandler);

app.get('/', (req,res) => {
    res.send('SAMPURASUN')
})
const syncModels = async () => {
    try {
        await config.authenticate();
        console.log("Database Connected...");

        console.log("Firebase initialized " + JSON.stringify(database));

        // Sinkronisasi model secara berurutan
        await Pengguna.sync();
        console.log("Pengguna synced.");

        
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1); // Exit jika ada kegagalan
    }
};

const startServer = async () => {
    try {
        await syncModels(); // Sinkronisasi model sebelum menjalankan server

        const port = process.env.PORT || 5001

        app.listen(port, () => {
            console.log(`Server berjalan pada http://localhost:${port}`)
        })
    } catch (error) {
        console.error("Failed to start the server:", error);
        process.exit(1); // Exit jika gagal menjalankan server
    }
};

startServer();
