import { ObjectId } from 'mongodb';
import mongoose, { Model } from 'mongoose';
import {
  isActiveMongooseField,
  removedAtMongooseField,
} from '../../mongoose/withMongooseFields';
import IMedia from './IMedia';

const Schema = new mongoose.Schema(
  {
    format: {
      type: String,
    },
    url: {
      type: String,
    },
    thumbnailUrl: {
      type: String,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    file: {
      name: { type: String },
      size: { type: Number },
      extension: { type: String },
      type: { type: String },
    },
    uploadLink: String,
    community: {
      type: ObjectId,
      required: true,
      ref: 'communities',
    },
    ...isActiveMongooseField,
    ...removedAtMongooseField,
  },
  {
    collection: 'medias',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

export type MediaModel = Model<IMedia>;

const MediaModel: MediaModel = mongoose.model<IMedia, MediaModel>(
  'medias',
  Schema,
);

export default MediaModel;
