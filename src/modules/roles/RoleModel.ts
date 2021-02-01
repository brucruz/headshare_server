import { ObjectId } from 'mongodb';
import mongoose, { Model } from 'mongoose';
import {
  isActiveMongooseField,
  removedAtMongooseField,
} from '../../mongoose/withMongooseFields';
import UserModel from '../users/UserModel';
import IRole, { RoleOptions } from './IRole';

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
  // encryptPassword(password: string): Promise<string>;
  isCreator(userId: string, communityId: string): Promise<boolean>;
}

Schema.statics = {
  async isCreator(userId: any, communityId: string): Promise<boolean> {
    const userRoles = await RoleModel.find({ user: userId });

    if (!userRoles) {
      return false;
    }

    const communityRole = userRoles.find(
      role => role.community.toString() === communityId.toString(),
    );

    if (!communityRole || communityRole.role !== RoleOptions.CREATOR) {
      return false;
    }

    return true;
  },
};

const RoleModel: RoleModel = mongoose.model<IRole, RoleModel>('roles', Schema);

export default RoleModel;
