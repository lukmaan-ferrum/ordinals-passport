import { FastifyRequest, FastifyReply } from 'fastify';
import { Passport } from '../models/passport';
import { connectToDb } from '../utils/connectToDb';


export const doLottery = async (request: FastifyRequest<{
    Querystring: { winners: string; tiers?: string[] }
}>, reply: FastifyReply) => {
    await connectToDb();
    const { winners, tiers } = request.query;

    const numWinners = parseInt(winners);
    if (isNaN(numWinners) || numWinners <= 0) {
        reply.status(400).send({ message: 'Invalid winners parameter. Must be a positive integer.' });
        return;
    }

    let query = {};
    if (tiers) {
        const validTiers = [0, 1, 2, 3];
        const tierValues = tiers.map(t => parseInt(t)).filter(t => validTiers.includes(t));
        if (tierValues.length === 0) {
        reply.status(400).send({ message: 'Invalid tiers parameter. Tiers must be one of 0, 1, 2, or 3.' });
        return;
        }
        query = { tier: { $in: tierValues } };
    }

    try {
        const passports = await Passport.find(query).select('passportId');
        const passportIds = passports.map(passport => passport.passportId);

        const shuffled = passportIds.sort(() => 0.5 - Math.random());
        const selectedWinners = shuffled.slice(0, numWinners);

        reply.status(200).send(selectedWinners);
    } catch (err) {
        reply.status(500).send({ message: 'Internal Server Error', error: (err as Error).message });
    }
};
