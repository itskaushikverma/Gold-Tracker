import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('[DB] MONGODB_URI is not defined in environment variables');
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log('[DB] Connection Success');

    mongoose.connection.on('error', (err) => {
      console.error('[DB] Connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[DB] Disconnected from MongoDB');
    });
  } catch (error) {
    console.error('[DB] Initial connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;
