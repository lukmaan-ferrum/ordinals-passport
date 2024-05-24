import { FastifyRequest, FastifyReply } from 'fastify';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Passport } from '../models/passport';
import { connectToDb } from '../utils/connectToDb';

const s3 = new AWS.S3();

export const updatePfp = async (request: FastifyRequest<{ Params: { vrf: string }, Body: { image: string; filename: string; mimetype: string } }>, reply: FastifyReply) => {
  await connectToDb();
  const { vrf } = request.params;
  const { image, filename, mimetype } = request.body;

  if (!image || !filename || !mimetype) {
    reply.status(400).send({ message: 'Image data, filename, and mimetype are required' });
    return;
  }

  // Decode the base64 string
  const buffer = Buffer.from(image, 'base64');

  // Validate the file type (optional)
  if (!mimetype.startsWith('image/')) {
    reply.status(400).send({ message: 'Invalid file type. Only image files are allowed.' });
    return;
  }

  // Generate a unique file name
  const fileName = `${uuidv4()}-${filename}`;

  try {
    // Upload the file to S3
    const uploadResult = await s3.upload({
      Bucket: process.env.S3_BUCKET!,
      Key: fileName,
      Body: buffer,
      ContentType: mimetype,
    }).promise();

    // Update the database with the S3 link
    const s3Link = uploadResult.Location;
    const passport = await Passport.findOneAndUpdate({ VRF: vrf }, { imageLink: s3Link }, { new: true });

    if (!passport) {
      reply.status(404).send({ message: 'VRF not found' });
      return;
    }

    reply.status(200).send({ message: 'PFP updated successfully', passport });
  } catch (err) {
    reply.status(500).send({ message: 'Internal Server Error', error: (err as Error).message });
  }
};
