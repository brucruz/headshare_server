import { ObjectId } from 'mongodb';
import mongoose, { Model } from 'mongoose';
import {
  isActiveMongooseField,
  removedAtMongooseField,
} from '../../mongoose/withMongooseFields';
import ITag from './ITag';

const Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      trim: true,
      required: true,
    },
    canonicalComponents: {
      type: String,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
    },
    community: {
      type: ObjectId,
      required: true,
      ref: 'communities',
    },
    posts: [
      {
        type: ObjectId,
        ref: 'posts',
      },
    ],
    ...isActiveMongooseField,
    ...removedAtMongooseField,
  },
  {
    collection: 'tags',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

export type TagModel = Model<ITag>;

const TagModel: TagModel = mongoose.model<ITag, TagModel>('tags', Schema);

export default TagModel;
