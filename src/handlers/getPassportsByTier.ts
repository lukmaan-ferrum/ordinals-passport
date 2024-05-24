import { FastifyRequest, FastifyReply } from 'fastify';
import { Passport } from '../models/passport';
import { connectToDb } from '../utils/connectToDb';


export const getPassportsByTier = async (request: FastifyRequest<{
    Querystring: { tier: string }
}>, reply: FastifyReply) => {
    await connectToDb();
    const { tier } = request.query;

    // Validate tier
    const validTiers = [0, 1, 2, 3];
    if (!tier || !validTiers.includes(parseInt(tier))) {
        reply.status(400).send({ message: 'Invalid or missing tier parameter. Tier must be one of 0, 1, 2, or 3.' });
        return;
    }

    try {
        const passports = await Passport.find({ tier: parseInt(tier) }).select('passportId');
        const passportIds = passports.map(passport => passport.passportId);
        reply.status(200).send(passportIds);
    } catch (err) {
        reply.status(500).send({ message: 'Internal Server Error', error: (err as Error).message });
    }
};
