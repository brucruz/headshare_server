/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from 'apollo-server-errors';
import CommunityModel from '../../communities/CommunityModel';
import ICommunity from '../../communities/ICommunity';
import RoleModel from '../../roles/RoleModel';

type CommunityDTO =
  | {
      _id?: undefined;
      slug: string;
    }
  | {
      _id: any;
      slug?: undefined;
    };

export async function isCreator(
  community: CommunityDTO,
  userId?: string,
): Promise<ICommunity> {
  if (!community._id && !community.slug) {
    throw new UserInputError('Community identification is missing', {
      field: 'community',
    });
  }

  let userCommunity: ICommunity | null;

  if (community.slug) {
    userCommunity = await CommunityModel.findOne({ slug: community.slug });
  } else {
    userCommunity = await CommunityModel.findById(community._id);
  }

  if (!userCommunity) {
    throw new ForbiddenError(
      'You must inform a valid community to perform this action',
    );
  }

  if (!userId) {
    throw new AuthenticationError(
      'You must be logged in to perform this action',
    );
  }

  const checkCreator = await RoleModel.isCreator(userId, userCommunity._id);

  if (!checkCreator) {
    throw new ForbiddenError('Only community creators may perform this action');
  }

  return userCommunity;
}
