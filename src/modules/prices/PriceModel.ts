import mongoose, { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import {
  isActiveMongooseField,
  removedAtMongooseField,
} from '../../mongoose/withMongooseFields';
import IPrice from './IPrice';

const Schema = new mongoose.Schema(
  {
    currency: {
      type: String,
    },
    nickname: {
      type: String,
    },
    type: {
      type: String,
    },
    recurringInterval: {
      type: String,
    },
    recurringIntervalCount: {
      type: String,
    },
    amount: {
      type: Number,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value',
      },
    },
    trialDays: {
      type: Number,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value',
      },
    },
    stripePriceId: {
      type: String,
    },
    product: {
      type: ObjectId,
      ref: 'products',
    },
    ...isActiveMongooseField,
    ...removedAtMongooseField,
  },
  {
    collection: 'prices',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

export type PriceModel = Model<IPrice>;

const PriceModel: PriceModel = mongoose.model<IPrice, PriceModel>(
  'prices',
  Schema,
);

export default PriceModel;
