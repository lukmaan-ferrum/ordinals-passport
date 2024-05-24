import awsLambdaFastify from '@fastify/aws-lambda';
import { createApp } from './app';

const proxy = awsLambdaFastify(createApp());

export const handler = proxy;
