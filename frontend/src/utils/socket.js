import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Ganti ke IP backend kamu kalau di deploy

export default socket;
