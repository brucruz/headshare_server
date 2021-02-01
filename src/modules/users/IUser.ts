import { Document } from 'mongoose';
import Post from '../posts/PostType';
import Role from '../roles/RoleType';

export interface IUser extends Document {
  name: string;
  surname?: string;
  password?: string;
  email: string;
  avatar?: string;
  posts: Post[];
  roles: Role[];
  isActive?: boolean;
  removedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  authenticate: (plainTextPassword: string) => Promise<boolean>;
}
