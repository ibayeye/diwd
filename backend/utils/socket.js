import { Server } from "socket.io";

let ioInstance = null;

const setupSocketIO = (httpServer) => {
    ioInstance = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    ioInstance.on('connection', (socket) => {
        console.log('📡 Client connected:', socket.id);

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
