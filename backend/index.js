import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRouter from './routes/auth/authRouter.js'
import deviceRouter from './routes/device/deviceRouter.js'
import mlRouter from './routes/machine-learning/mlRouter.js'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import router from './routes/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import { syncDatabase } from './models/index.js';
import redisClient, { connectRedis } from './config/redis.js';
import { setupSocketIO } from './utils/socket.js';
import { createServer } from 'http';
// import { sendNotification } from './controller/mailer/mailerController.js';

dotenv.config()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = setupSocketIO(httpServer);

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
// app.use(
//     cors({
//         origin: "*", // Asal spesifik frontend Anda
//         credentials: false, // Izinkan kredensial (cookie)
//     })
// );
app.use(
    cors()
);

app.get('/ping', (req, res) => {
    res.send('Ping received! App is active.');
});

app.get('/test-redis-set', async (req, res) => {
    await redisClient.set('___tes_saya', 'cek_dari_vs_code');
    res.json({ message: 'key diset' });
});

// routing
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/', deviceRouter);
app.use('/api/v1/', mlRouter);
app.use(router);

//middleware error
app.use(notFound);
app.use(errorHandler);


const startServer = async () => {
    try {
        await connectRedis();

        await syncDatabase(); // Sinkronisasi model sebelum menjalankan server

        const port = process.env.PORT || 5001

        httpServer.listen(port, () => {
            console.log(`🚀 Server berjalan di port ${port}`);
        });

    } catch (error) {
        console.error("Failed to start the server:", error);
        process.exit(1); // Exit jika gagal menjalankan server
    }
};

startServer();
