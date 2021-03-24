import { Document } from 'mongoose';
import Community from '../communities/CommunityType';
import PaginatedPosts from '../posts/resolvers/PaginatedPosts';

export default interface ITag extends Document {
  title: string;
  slug: string;
  description?: string;
  community: Community;
  posts: PaginatedPosts;
  postCount: number;
  isActive: boolean;
  removedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
