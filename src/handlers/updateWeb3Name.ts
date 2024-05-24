import { FastifyRequest, FastifyReply } from 'fastify';
import { Passport } from '../models/passport';
import { connectToDb } from '../utils/connectToDb'; 


export const updateWeb3Name = async (request: FastifyRequest<{
	Params: { vrf: string },
	Body: { web3Name: string }
}>,
	reply: FastifyReply
) => {
    await connectToDb();
    const { vrf } = request.params;
    const { web3Name } = request.body;

    try {
        const passport = await Passport.findOneAndUpdate({ VRF: vrf }, { web3Name }, { new: true });

        if (!passport) {
            reply.status(404).send({ message: 'VRF not found' });
            return;
        }

        reply.status(200).send({ message: 'web3Name updated successfully', passport });
    } catch (err) {
        reply.status(500).send({ message: 'Internal Server Error', error: (err as Error).message });
    }
};
