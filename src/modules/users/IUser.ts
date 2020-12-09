import { Document } from 'mongoose';
import Post from '../posts/PostType';

export interface IUser extends Document {
  name: string;
  surname?: string;
  password?: string;
  email: string;
  isActive?: boolean;
  posts?: Post[];
  removedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  authenticate: (plainTextPassword: string) => Promise<boolean>;
}
