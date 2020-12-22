import { Document } from 'mongoose';
import { registerEnumType } from 'type-graphql';
import Community from '../communities/CommunityType';
import User from '../users/UserType';

// eslint-disable-next-line no-shadow
export enum RoleOptions {
  SUPER_ADMIN = 'super_admin',
  CREATOR = 'creator',
  MEMBER = 'member',
  FOLLOWER = 'follower',
}

registerEnumType(RoleOptions, {
  name: 'RoleOptions',
  description: 'The possible roles an user can assume in a community',
  valuesConfig: {
    SUPER_ADMIN: {
      description:
        'Super users that have full access rights to all communities',
    },
    CREATOR: {
      description:
        'The user who created the community and thus have full access rights to the community',
    },
    MEMBER: {
      description:
        'A user who is a paying member of a community, and have access to all its restricted content',
    },
    FOLLOWER: {
      description:
        'A user who is a free member of a community and have chosen to share its data with the community, to be notified of new unrestricted content',
    },
  },
});

export default interface IRole extends Document {
  role: RoleOptions;
  user: User;
  community: Community;
  isActive?: boolean;
  removedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
