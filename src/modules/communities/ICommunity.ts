import { Document } from 'mongoose';
import Media from '../medias/MediaType';
import PaginatedPosts from '../posts/resolvers/PaginatedPosts';
import Role from '../roles/RoleType';
import Tag from '../tags/TagType';
import User from '../users/UserType';

export interface IHighlightedTag {
  tag: Tag;
  order: number;
}
export default interface ICommunity extends Document {
  logo?: string;
  title: string;
  slug: string;
  tagline?: string;
  description?: string;
  avatar?: Media;
  banner?: Media;
  posts: PaginatedPosts;
  tags: Tag[];
  highlightedTags: IHighlightedTag[];
  roles: Role[];
  creator: User;
  followersCount: number;
  membersCount: number;
  isActive: boolean;
  removedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
