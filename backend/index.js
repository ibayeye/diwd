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
import Device from './models/device.js';
import router from './routes/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import DeviceEarthquake from './models/deviceEarthquake.js';
import { detectedEarthquakeListener, trackedFailureListener } from './controller/device/deviceController.js';
import DeviceError from './models/deviceError.js';
import { v2 as cloudinary } from 'cloudinary';
// import { sendNotification } from './controller/mailer/mailerController.js';

dotenv.config()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:3000", // Asal spesifik frontend Anda
        credentials: true, // Izinkan kredensial (cookie)
    })
);


// Tambahkan variable global untuk track status listener
let isListenerActive = false;

// Fungsi untuk setup dan manage listener
const setupFirebaseListeners = () => {
    // Cek apakah listener sudah aktif
    if (!isListenerActive) {
        try {
            // Jalankan kedua listener
            trackedFailureListener();
            detectedEarthquakeListener();

            // Set flag ke true kalau berhasil
            isListenerActive = true;
            console.log("Firebase listeners activated successfully at:", new Date().toISOString());

        } catch (error) {
            console.error("Failed to setup Firebase listeners:", error);

            // Jika gagal, coba lagi setelah 5 detik
            setTimeout(setupFirebaseListeners, 5000);

            // Log untuk tracking retry
            console.log("Retrying listener setup in 5 seconds...");
        }
    }
};

// Integrasikan dengan endpoint ping
app.get('/ping', (req, res) => {
    // Setiap kali di-ping, cek dan setup listener kalau belum aktif
    setupFirebaseListeners();

    // Tambahkan informasi status di response
    res.json({
        status: 'active',
        listenerStatus: isListenerActive ? 'running' : 'inactive',
        timestamp: new Date().toISOString()
    });
});

// app.get('/ping', (req, res) => {
//     res.send('Ping received! App is active.');
// });

// routing
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/', deviceRouter);
app.use(router);

//middleware error
app.use(notFound);
app.use(errorHandler);

const syncModels = async () => {
    try {
        await config.authenticate();
        console.log("Database Connected...");

        console.log("Firebase initialized " + JSON.stringify(database));

        // await config.sync({alter: true})

        // Sinkronisasi model secara berurutan
        await Pengguna.sync();
        console.log("Pengguna synced.");

        await DeviceError.sync();
        console.log("Device Error synced.");

        await DeviceEarthquake.sync();
        console.log("Device Earthquake synced.");

        await Device.sync();
        console.log("Device synced.");

        // // Tambahkan try-catch khusus untuk listener
        // try {
        //     trackedFailureListener();
        //     console.log("Listener Failure aktif.");

        //     detectedEarthquakeListener();
        //     console.log("Listener Earthquake aktif.");
        // } catch (listenerError) {
        //     console.error("Error saat menginisialisasi listener:", listenerError);
        //     // Bisa putuskan apakah perlu menghentikan aplikasi atau tidak
        //     // Jika listener tidak kritis, bisa lanjut tanpa listener
        // }

    } catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1);
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
