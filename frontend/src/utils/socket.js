import { io } from "socket.io-client";


const socket = io("https://server.diwd.cloud", {
    transports: ["websocket"], // lebih stabil
    autoConnect: true,         // auto connect
});// Ganti ke IP backend kamu kalau di deploy

export default socket;
