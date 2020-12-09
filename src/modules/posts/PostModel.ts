import { ObjectId } from 'mongodb';
import mongoose, { Model } from 'mongoose';
import {
  isActiveMongooseField,
  removedAtMongooseField,
} from '../../mongoose/withMongooseFields';
import IPost from './IPost';

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
    description: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
    },
    creator: {
      type: ObjectId,
      required: true,
      ref: 'users',
    },
    ...isActiveMongooseField,
    ...removedAtMongooseField,
  },
  {
    collection: 'posts',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

export type PostModel = Model<IPost>;

const PostModel: PostModel = mongoose.model<IPost, PostModel>('posts', Schema);

export default PostModel;
