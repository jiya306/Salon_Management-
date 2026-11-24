import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/salonflow';

// Reuse one connection instead of reconnecting on every request
let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(MONGODB_URI);
  }
  try {
    const conn = await connectionPromise;
    console.log(`[MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    connectionPromise = null;
    console.error('[MongoDB] Connection error:', error);
    throw error;
  }
};
