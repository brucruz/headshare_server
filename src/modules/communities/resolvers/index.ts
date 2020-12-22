import { ObjectId } from 'mongodb';
import {
  Resolver,
  Query,
  UseMiddleware,
  Mutation,
  Arg,
  Ctx,
  FieldResolver,
  Root,
  Int,
} from 'type-graphql';
import { ApolloContext } from '../../../apollo-server/ApolloContext';
import isAuth from '../../../middlewares/isAuth';
import IPost from '../../posts/IPost';
import PostModel from '../../posts/PostModel';
import Post from '../../posts/PostType';
import IRole, { RoleOptions } from '../../roles/IRole';
import RoleModel from '../../roles/RoleModel';
import Role from '../../roles/RoleType';
import { IUser } from '../../users/IUser';
import UserModel from '../../users/UserModel';
import User from '../../users/UserType';
import CommunityModel from '../CommunityModel';
import Community from '../CommunityType';
import CommunitiesResponse from './CommunitiesResponse';
import CommunityResponse from './CommunityResponse';
import CreateCommunityInput from './input/CreateCommunityInput';
import UpdateCommunityInput from './input/UpdateCommunityInput';

@Resolver(_of => Community)
export default class CommunityResolver {
  @Query(() => CommunitiesResponse)
  async communities(): Promise<CommunitiesResponse> {
    const communities = await CommunityModel.find({});

    return {
      communities,
    };
  }

  @Query(() => CommunityResponse)
  async community(@Arg('slug') slug: string): Promise<CommunityResponse> {
    const community = await CommunityModel.findOne({ slug });

    if (!community) {
      return {
        errors: [
          {
            field: 'slug',
            message: 'No community found with this slug',
          },
        ],
      };
    }

    return {
      community,
    };
  }

  @Mutation(() => CommunityResponse, {
    description: 'Users can create a community',
  })
  @UseMiddleware(isAuth)
  async createCommunity(
    @Arg('communityData')
    { logo, title, slug, description }: CreateCommunityInput,
    @Ctx() { req }: ApolloContext,
  ): Promise<CommunityResponse> {
    const creator = req.user?.id;

    if (!creator) {
      return {
        errors: [
          {
            field: 'token',
            message: 'You must provide a valid JWT token to create a community',
          },
        ],
      };
    }

    const community = new CommunityModel({
      logo,
      title,
      slug,
      description,
    });

    await community.save();

    const role = new RoleModel({
      community: community._id,
      role: RoleOptions.CREATOR,
      user: creator,
    });

    await role.save();

    return {
      community,
    };
  }

  @Mutation(() => CommunityResponse)
  @UseMiddleware(isAuth)
  async updateCommunity(
    @Arg('id') id: string,
    @Arg('updateData') { title, slug, description, logo }: UpdateCommunityInput,
  ): Promise<CommunityResponse> {
    const newData = {
      $set: {
        ...(title ? { title } : {}),
        ...(slug ? { slug } : {}),
        ...(description ? { description } : {}),
        ...(logo ? { logo } : {}),
      },
    };

    const community = await CommunityModel.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      { ...newData },
      {
        new: true,
      },
    );

    if (!community) {
      return {
        errors: [
          {
            field: 'id',
            message: 'No community found with the informed id',
          },
        ],
      };
    }

    await community.save();

    return { community };
  }

  @FieldResolver(() => [Post])
  async posts(@Root() community: Community): Promise<IPost[]> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await PostModel.find({ community: community._doc._id }))!;
  }

  @FieldResolver(() => [Role])
  async roles(@Root() community: Community): Promise<IRole[]> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await RoleModel.find({ community: community._doc._id }))!;
  }

  @FieldResolver(() => User)
  async creator(@Root() community: Community): Promise<IUser | null> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const role = await RoleModel.findOne({
      $and: [{ community: community._doc._id }, { role: RoleOptions.CREATOR }],
    })!;

    return UserModel.findById(role?.user);
  }

  @FieldResolver(() => Int)
  async followersCount(@Root() community: Community): Promise<number> {
    return RoleModel.countDocuments(
      {
        $and: [
          { community: community._doc._id },
          { role: RoleOptions.FOLLOWER },
        ],
      },
      function countFollowers(err, count) {
        if (err) {
          return 0;
        }
        return count;
      },
    );
  }

  @FieldResolver(() => Int)
  async membersCount(@Root() community: Community): Promise<number> {
    return RoleModel.countDocuments(
      {
        $and: [{ community: community._doc._id }, { role: RoleOptions.MEMBER }],
      },
      function countMembers(err, count) {
        if (err) {
          return 0;
        }
        return count;
      },
    );
  }
}
