import mongoose, { Model } from 'mongoose';
import {
  isActiveMongooseField,
  removedAtMongooseField,
} from '../../mongoose/withMongooseFields';
import ICommunity from './ICommunity';

const Schema = new mongoose.Schema(
  {
    logo: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
    },
    ...isActiveMongooseField,
    ...removedAtMongooseField,
  },
  {
    collection: 'communities',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

export type CommunityModel = Model<ICommunity>;

const CommunityModel: CommunityModel = mongoose.model<
  ICommunity,
  CommunityModel
>('communities', Schema);

export default CommunityModel;
