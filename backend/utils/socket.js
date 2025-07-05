import { Server } from "socket.io";
import redisClient from "../config/redis.js";

let ioInstance = null;

const setupSocketIO = (httpServer) => {
    ioInstance = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    ioInstance.on("connection", async (socket) => {
        console.log('📡 Client connected:', socket.id);
    
        const sendCurrentState = async () => {
            try {
                const keys = await redisClient.keys("*");
                const earthquakeDevices = [];
                const errorDevices = [];
    
                for (const key of keys) {
                    if (key.startsWith("earthquake:")) {
                        earthquakeDevices.push(key.split(":")[1]);
                    }
                    if (key.startsWith("error:")) {
                        errorDevices.push(key.split(":")[1]);
                    }
                }
    
                socket.emit("current-state", {
                    earthquakes: earthquakeDevices,
                    errors: errorDevices,
                });
                console.log(`📤 Sent current-state to ${socket.id}`);
            } catch (err) {
                console.error("❌ Error sending current-state:", err);
            }
        };
    
        // Initial emit
        await sendCurrentState();
    
        // Listener kalau diminta manual
        socket.on("request-current-state", async () => {
            console.log(`🔄 ${socket.id} requested current state manually`);
            await sendCurrentState();
        });
    
        socket.on('disconnect', () => {
            console.log('❌ Client disconnected:', socket.id);
        });
    });
    

    return ioInstance;
};

// Fungsi untuk mengambil instance aktif
const getSocketInstance = () => {
    if (!ioInstance) {
        throw new Error("Socket.IO has not been initialized.");
    }
    return ioInstance;
};

export { setupSocketIO, getSocketInstance };
