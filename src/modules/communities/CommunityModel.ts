import mongoose, { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
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
    tagline: {
      type: String,
    },
    description: {
      type: String,
    },
    avatar: {
      type: ObjectId,
      ref: 'medias',
    },
    banner: {
      type: ObjectId,
      ref: 'medias',
    },
    posts: [
      {
        type: ObjectId,
        ref: 'posts',
      },
    ],
    tags: [
      {
        type: ObjectId,
        ref: 'tags',
      },
    ],
    highlightedTags: [
      {
        tag: {
          type: ObjectId,
          ref: 'tags',
        },
        order: {
          type: Number,
        },
      },
    ],
    roles: [
      {
        type: ObjectId,
        ref: 'roles',
      },
    ],
    creator: [
      {
        type: ObjectId,
        ref: 'users',
      },
    ],
    followersCount: {
      type: Number,
    },
    membersCount: {
      type: Number,
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
