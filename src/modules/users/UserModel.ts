import { hash, verify } from 'argon2';
import { ObjectId } from 'mongodb';
import mongoose, { Model } from 'mongoose';
import {
  isActiveMongooseField,
  removedAtMongooseField,
} from '../../mongoose/withMongooseFields';
import { IUser } from './IUser';

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    surname: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      index: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    avatar_url: {
      type: String,
    },
    posts: [
      {
        type: ObjectId,
        ref: 'posts',
      },
    ],
    roles: [
      {
        type: ObjectId,
        ref: 'roles',
      },
    ],
    ...isActiveMongooseField,
    ...removedAtMongooseField,
  },
  {
    collection: 'users',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

export interface UserModel extends Model<IUser> {
  encryptPassword(password: string): Promise<string>;
}

const UserModel: UserModel = mongoose.model<IUser, UserModel>('users', Schema);

export default UserModel;

Schema.methods = {
  async authenticate(plainText: string) {
    try {
      return verify(this.password || '', plainText);
    } catch (err) {
      return false;
    }
  },
};

Schema.statics = {
  async encryptPassword(password: string): Promise<string> {
    return hash(password);
  },
};

// Schema.pre<IUser>('save', async function preSave() {
//   if (this.isModified('password') && this.password) {
//     this.password = await UserModel.encryptPassword(this.password);
//   }
// });

// async function preUpdate(this: any) {
//   const update = this.getUpdate();
//   if (update && update.password) {
//     update.password = await UserModel.encryptPassword(update.password);
//   }
//   if (update.$set && update.$set.password) {
//     update.$set.password = await UserModel.encryptPassword(
//       update.$set.password,
//     );
//   }
// }

// Schema.pre('update', preUpdate);
// Schema.pre('updateMany', preUpdate);
// Schema.pre('updateOne', preUpdate);
// Schema.pre('findOneAndUpdate', preUpdate);

// Schema.pre<IUser>('insertMany', async function preInsertMany() {
//   if (this.isModified('password') && this.password) {
//     this.password = await UserModel.encryptPassword(this.password);
//   }
// });
