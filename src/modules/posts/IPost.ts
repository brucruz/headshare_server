import { Document } from 'mongoose';
import { registerEnumType } from 'type-graphql';
import Community from '../communities/CommunityType';
import Media from '../medias/MediaType';
import PaginatedTags from '../tags/resolvers/PaginatedTags';
import User from '../users/UserType';

// eslint-disable-next-line no-shadow
export enum PostStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
}

registerEnumType(PostStatus, {
  name: 'PostStatus',
  description: 'The possible status a post might have',
  valuesConfig: {
    PUBLISHED: {
      description:
        'A post after been submited by its creator and now visible to every allowed member',
    },
    DRAFT: {
      description: 'A post while is being written and visible only its creator',
    },
    SCHEDULED: {
      description: 'A post scheduled to be submited in a future date and hour',
    },
  },
});
export default interface IPost extends Document {
  title?: string;
  formattedTitle?: string;
  slug?: string;
  canonicalComponents?: string;
  description?: string;
  mainMedia?: Media;
  status: PostStatus;
  content?: string;
  exclusive: boolean;
  likes: number;
  creator: User;
  community: Community;
  tags: PaginatedTags;
  isActive: boolean;
  removedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
