import { Document } from 'mongoose';
import Community from '../communities/CommunityType';
import Post from '../posts/PostType';

export default interface ITag extends Document {
  title: string;
  slug: string;
  description?: string;
  community: Community;
  posts: Post[];
  isActive: boolean;
  removedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
