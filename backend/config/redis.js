// config/redis.js
import { createClient } from 'redis';

const redisClient = createClient({
  // url: 'redis://localhost:6379',
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500),
    connectTimeout: 60000,
    lazyConnect: true
  }
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.on('connect', () => {
  console.log('Redis connecting...');
});

redisClient.on('ready', () => {
  console.log('Redis ready and connected!');
});

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("Redis connected successfully");
    }
    return redisClient;
  } catch (error) {
    console.error("Redis connection failed:", error);
    throw error;
  }
};

export default redisClient;