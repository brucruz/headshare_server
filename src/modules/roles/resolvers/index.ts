import { ObjectId } from 'mongodb';
import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Root,
  FieldResolver,
} from 'type-graphql';
import CommunityModel from '../../communities/CommunityModel';
import ICommunity from '../../communities/ICommunity';
import { IUser } from '../../users/IUser';
import UserModel from '../../users/UserModel';
import CreateRoleInput from '../inputs/CreateRoleInput';
import UpdateRoleInput from '../inputs/UpdateRoleInput';
import RoleModel from '../RoleModel';
import Role from '../RoleType';
import RoleResponse from './RoleResponse';
import RolesResponse from './RolesResponse';

@Resolver(_of => Role)
export default class RoleResolver {
  @Query(() => RolesResponse, { description: 'Queries all roles in database' })
  async roles(
    @Arg('communitySlug', () => String, { nullable: true })
    communitySlug?: string,
    @Arg('userId', () => String, { nullable: true }) userId?: string,
  ): Promise<RolesResponse> {
    let community: ICommunity | null = null;
    let user: IUser | null = null;

    if (communitySlug) {
      community = await CommunityModel.findOne({ slug: communitySlug });

      if (!community) {
        return {
          errors: [
            {
              field: 'community',
              message: 'The community informed does not exist',
            },
          ],
        };
      }
    }

    if (userId) {
      user = await UserModel.findById(userId);

      if (!user) {
        return {
          errors: [
            {
              field: 'id',
              message: 'The community informed does not exist',
            },
          ],
        };
      }
    }

    const queryFilters = {
      ...(community ? { community: community._id } : {}),
      ...(user ? { user: user._id } : {}),
    };

    const roles = await RoleModel.find({
      ...queryFilters,
    });

    return { roles };
  }

  @Query(() => RoleResponse, {
    nullable: true,
    description:
      'Queries an role by providing an email. If none is found, return null.',
  })
  async role(
    @Arg('id', () => CreateRoleInput) id: string,
  ): Promise<RoleResponse> {
    const role = await RoleModel.findOne({ _id: new ObjectId(id) });

    if (!role) {
      return {
        errors: [
          {
            field: 'id',
            message: 'No role found with the informed id',
          },
        ],
      };
    }
    return { role };
  }

  @Mutation(_returns => RoleResponse)
  async createRole(
    @Arg('data', () => CreateRoleInput)
    { role, community, user }: CreateRoleInput,
  ): Promise<RoleResponse> {
    const communityData = await CommunityModel.findById(community);

    if (!communityData) {
      return {
        errors: [
          {
            field: 'community',
            message: 'You must inform a valid community to create a role',
          },
        ],
      };
    }

    const userData = await UserModel.findById(user);

    if (!userData) {
      return {
        errors: [
          {
            field: 'user',
            message: 'You must inform a valid user to create a role',
          },
        ],
      };
    }

    const checkUserinCommunity = await RoleModel.findOne({
      $and: [
        {
          user: userData._id,
        },
        {
          community: communityData._id,
        },
      ],
    });

    if (checkUserinCommunity) {
      return {
        errors: [
          {
            field: 'user/community',
            message:
              'Thew informed user has already a defined role in the informed community',
          },
        ],
      };
    }

    const userRole = new RoleModel({
      role,
      user,
      community,
    });

    await userRole.save();

    return { role: userRole };
  }

  @Mutation(() => RoleResponse, { nullable: true })
  async updateRole(
    @Arg('id', () => String) id: string,
    @Arg('updateData', () => UpdateRoleInput)
    { role }: UpdateRoleInput,
  ): Promise<RoleResponse> {
    const newData = {
      $set: {
        ...(role ? { role } : {}),
      },
    };

    const userRole = await RoleModel.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      { ...newData },
      {
        new: true,
      },
    );

    if (!userRole) {
      return {
        errors: [
          {
            field: 'id',
            message: 'No user role found with the informed id',
          },
        ],
      };
    }

    await userRole.save();

    return { role: userRole };
  }

  @FieldResolver()
  async community(@Root() role: Role): Promise<ICommunity> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await CommunityModel.findById(role._doc.community))!;
  }

  @FieldResolver()
  async user(@Root() role: Role): Promise<IUser> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await UserModel.findById(role._doc.user))!;
  }
}
