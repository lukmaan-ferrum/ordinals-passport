import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDb = async () => {
  if (isConnected) {
    console.log('=> using existing database connection');
    return;
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('MongoDB connection string is missing in environment variables');
    throw new Error('MongoDB connection string is missing in environment variables');
  }

  try {
    console.log('Connecting to MongoDB:', mongoUri);
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log('=> using new database connection');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};
