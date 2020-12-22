import { Document } from 'mongoose';
import Post from '../posts/PostType';
import Role from '../roles/RoleType';
import User from '../users/UserType';

export default interface ICommunity extends Document {
  logo?: string;
  title: string;
  slug: string;
  description?: string;
  posts: Post[];
  roles: Role[];
  creator: User;
  followersCount: number;
  membersCount: number;
  isActive: boolean;
  removedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
