import { ObjectId } from 'mongodb';
import mongoose, { Model } from 'mongoose';
import {
  isActiveMongooseField,
  removedAtMongooseField,
} from '../../mongoose/withMongooseFields';
import IRole from './IRole';

const Schema = new mongoose.Schema(
  {
    role: {
      type: String,
      trim: true,
      required: true,
    },
    user: {
      type: ObjectId,
      ref: 'users',
    },
    community: {
      type: ObjectId,
      ref: 'communities',
    },
    ...isActiveMongooseField,
    ...removedAtMongooseField,
  },
  {
    collection: 'roles',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

export interface RoleModel extends Model<IRole> {
  encryptPassword(password: string): Promise<string>;
}

const RoleModel: RoleModel = mongoose.model<IRole, RoleModel>('roles', Schema);

export default RoleModel;
