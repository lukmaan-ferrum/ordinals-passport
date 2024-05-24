import { FastifyRequest, FastifyReply } from 'fastify';
import { Passport } from '../models/passport';
import { connectToDb } from '../utils/connectToDb';


export const bulkUploadVrf = async (request: FastifyRequest<{
	Body: { vrfNumbers: string[] }
}>, reply: FastifyReply) => {
    await connectToDb();
    const { vrfNumbers } = request.body;

    try {
        const currentMaxPassportIdDoc = await Passport.findOne().sort('-passportId');
        let currentMaxPassportId = currentMaxPassportIdDoc ? currentMaxPassportIdDoc.passportId : -1;

        const newPassports = vrfNumbers.map((vrf) => {
        currentMaxPassportId += 1;
        return {
            VRF: vrf,
            imageLink: '',
            passportId: currentMaxPassportId,
            activations: [],
            tier: 0,
            web3Name: '',
        };
        });

        await Passport.insertMany(newPassports);

        reply.status(200).send({ message: 'Passports created successfully' });
    } catch (err) {
        reply.status(500).send({ message: 'Internal Server Error', error: (err as Error).message });
    }
};