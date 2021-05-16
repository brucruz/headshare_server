import { ObjectId } from 'mongodb';
import mongoose, { Model } from 'mongoose';
import {
  isActiveMongooseField,
  removedAtMongooseField,
} from '../../mongoose/withMongooseFields';
import IPost, { PostStatus } from './IPost';

const Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    formattedTitle: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    canonicalComponents: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      default: PostStatus.DRAFT,
    },
    mainMedia: {
      type: ObjectId,
      required: false,
      ref: 'medias',
    },
    cover: {
      type: ObjectId,
      required: false,
      ref: 'medias',
    },
    content: {
      type: String,
    },
    exclusive: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Number,
    },
    creator: {
      type: ObjectId,
      required: true,
      ref: 'users',
    },
    community: {
      type: ObjectId,
      required: true,
      ref: 'communities',
    },
    tags: [
      {
        type: ObjectId,
        ref: 'tags',
      },
    ],
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
