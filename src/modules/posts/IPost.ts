import { Document } from 'mongoose';
import Community from '../communities/CommunityType';
import Tag from '../tags/TagType';
import User from '../users/UserType';

export default interface IPost extends Document {
  title: string;
  slug: string;
  canonicalComponents: string;
  description?: string;
  content: string;
  likes?: number;
  creator: User;
  community: Community;
  tags: Tag[];
  isActive: boolean;
  removedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
