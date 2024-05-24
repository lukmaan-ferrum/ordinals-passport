import { FastifyRequest, FastifyReply } from 'fastify';
import { Passport } from '../models/passport';
import { connectToDb } from '../utils/connectToDb';

export const getVrfDocument = async (request: FastifyRequest<{ Params: { vrf: string } }>, reply: FastifyReply) => {
  try {
    console.log('Handler getVrfDocument called');
    await connectToDb();
    const { vrf } = request.params;
    console.log(`Fetching passport for VRF: ${vrf}`);
    const passport = await Passport.findOne({ VRF: vrf });
    if (!passport) {
      reply.status(404).send({ message: 'VRF not found' });
      return;
    }
    console.log(`Passport found: ${passport}`);
    reply.status(200).send(passport);
  } catch (err) {
    console.error('Error fetching VRF document:', err);
    reply.status(500).send({ message: 'Internal Server Error', error: (err as Error).message });
  }
};
