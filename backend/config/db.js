import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('[DB] MONGO_URI is not defined in environment variables');
  }

  await mongoose.connect(mongoUri);
  console.log('[DB] Connection Success');

  mongoose.connection.on('error', (err) => {
    console.error('[DB] Connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[DB] Disconnected from MongoDB');
  });
};

export default connectDB;
