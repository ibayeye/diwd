import { io } from "socket.io-client";

const socket = io("https://server.diwd.cloud"); // Ganti ke IP backend kamu kalau di deploy

export default socket;
