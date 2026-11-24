import app from './app.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[SalonFlow API] Server running smoothly on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('[SalonFlow API] Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
