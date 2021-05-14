import { ObjectId } from 'mongodb';
import mongoose, { Model } from 'mongoose';
import {
  isActiveMongooseField,
  removedAtMongooseField,
} from '../../mongoose/withMongooseFields';
import { ICard } from './ICard';

const Schema = new mongoose.Schema(
  {
    pagarmeId: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    holderName: {
      type: String,
      trim: true,
    },
    firstDigits: {
      type: String,
      trim: true,
    },
    lastDigits: {
      type: String,
      trim: true,
    },
    fingerprint: {
      type: String,
      trim: true,
    },
    valid: {
      type: Boolean,
    },
    expirationDate: {
      type: String,
      trim: true,
    },
    isMain: {
      type: Boolean,
      default: false,
    },
    user: {
      type: ObjectId,
      ref: 'users',
    },
    ...isActiveMongooseField,
    ...removedAtMongooseField,
  },
  {
    collection: 'cards',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

export type CardModel = Model<ICard>;

const CardModel: CardModel = mongoose.model<ICard, CardModel>('cards', Schema);

export default CardModel;
