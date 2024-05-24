import mongoose, { Schema, Document } from 'mongoose';

export interface IPassport extends Document {
  VRF: string;
  imageLink: string;
  passportId: number;
  activations: number[];
  tier: number;
  web3Name: string;
}

const PassportSchema: Schema = new Schema({
  VRF: { type: String, required: true, unique: true },
  imageLink: { type: String, required: false },
  passportId: { type: Number, required: true },
  activations: { type: [Number], required: false },
  tier: { type: Number, required: false, default: 0 },
  web3Name: { type: String, required: false },
});

export const Passport = mongoose.model<IPassport>('Passport', PassportSchema);
