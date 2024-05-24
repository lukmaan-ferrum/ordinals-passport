import { FastifyRequest, FastifyReply } from 'fastify';
import mongoose from 'mongoose';

export const testConnectivity = async (request: FastifyRequest, reply: FastifyReply) => {
  const MONGO_URI = process.env.MONGO_URI!;

  try {
    console.log('Handler testConnectivity called');
    
    const startConnection = Date.now();
    await mongoose.connect(MONGO_URI);
    const connectionDuration = Date.now() - startConnection;
    console.log(`Database connection duration: ${connectionDuration}ms`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

    reply.status(200).send({
      message: 'Connected successfully',
      connectionDuration,
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    reply.status(500).send({
      message: 'Connection failed'
    });
  }
};
