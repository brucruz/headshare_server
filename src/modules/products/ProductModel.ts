import mongoose, { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import {
  isActiveMongooseField,
  removedAtMongooseField,
} from '../../mongoose/withMongooseFields';
import IProduct from './IProduct';

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
    },
    benefits: [
      {
        description: {
          type: String,
        },
        order: {
          type: Number,
        },
      },
    ],
    statementDescriptor: {
      type: String,
    },
    stripeProductId: {
      type: String,
    },
    community: {
      type: ObjectId,
      ref: 'communities',
    },
    ...isActiveMongooseField,
    ...removedAtMongooseField,
  },
  {
    collection: 'products',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

export type ProductModel = Model<IProduct>;

const ProductModel: ProductModel = mongoose.model<IProduct, ProductModel>(
  'products',
  Schema,
);

export default ProductModel;
