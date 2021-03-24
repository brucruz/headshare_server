import { ObjectId } from 'mongodb';
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  FieldResolver,
  Root,
  Int,
} from 'type-graphql';
import { ApolloContext } from '../../../apollo-server/ApolloContext';
import IMedia from '../../medias/IMedia';
import MediaModel from '../../medias/MediaModel';
import PostModel from '../../posts/PostModel';
import PaginatedPosts from '../../posts/resolvers/PaginatedPosts';
import IRole, { RoleOptions } from '../../roles/IRole';
import RoleModel from '../../roles/RoleModel';
import Role from '../../roles/RoleType';
import ITag from '../../tags/ITag';
import TagModel from '../../tags/TagModel';
import Tag from '../../tags/TagType';
import { IUser } from '../../users/IUser';
import UserModel from '../../users/UserModel';
import User from '../../users/UserType';
import CommunityModel from '../CommunityModel';
import Community from '../CommunityType';
import HighlightedTag from '../HighlightTagType';
import { IHighlightedTag } from '../ICommunity';
import CommunitiesResponse from './CommunitiesResponse';
import CommunityResponse from './CommunityResponse';
import CreateCommunityInput from './input/CreateCommunityInput';
import HighlightedTagInput from './input/HighlightedTagInput';
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
  async community(
    @Arg('slug', () => String) slug: string,
  ): Promise<CommunityResponse> {
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
  async createCommunity(
    @Arg('communityData', () => CreateCommunityInput)
    { logo, title, slug, tagline, description }: CreateCommunityInput,
    @Ctx() { req }: ApolloContext,
  ): Promise<CommunityResponse> {
    const creator = req.session.userId;

    if (!creator) {
      return {
        errors: [
          {
            field: 'userId',
            message: 'You must be logged in to perform this action',
          },
        ],
      };
    }

    const community = new CommunityModel({
      logo,
      title,
      slug,
      tagline,
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
  async updateCommunity(
    @Arg('id', () => String) id: string,
    @Arg('updateData', () => UpdateCommunityInput)
    {
      title,
      slug,
      tagline,
      description,
      logo,
      avatar,
      banner,
      highlightedTags,
    }: UpdateCommunityInput,
    @Ctx() { req }: ApolloContext,
  ): Promise<CommunityResponse> {
    const { userId } = req.session;

    if (!userId) {
      return {
        errors: [
          {
            field: 'userId',
            message: 'You must be logged in to perform this action',
          },
        ],
      };
    }

    const isCreator = await RoleModel.isCreator(userId, id);

    if (!isCreator) {
      return {
        errors: [
          {
            field: 'role',
            message: 'Only community creators may perform this action',
          },
        ],
      };
    }

    let avatarObject;

    if (avatar) {
      avatarObject = await MediaModel.findById(avatar);

      if (!avatarObject) {
        return {
          errors: [
            {
              field: 'avatar',
              message: 'Media Id is incorrect',
            },
          ],
        };
      }
    }

    let bannerObject;

    if (banner) {
      bannerObject = await MediaModel.findById(banner);

      if (!bannerObject) {
        return {
          errors: [
            {
              field: 'banner',
              message: 'Media Id is incorrect',
            },
          ],
        };
      }
    }

    let highlightedTagsObject;
    let highlightedTagsObjectResolved;
    let highlightedTagsObjectFinal;

    if (highlightedTags) {
      highlightedTagsObject = highlightedTags.flatMap(
        async function flatMapHighlightedTags(item: HighlightedTagInput) {
          const tag = await TagModel.findById(item.tag);

          if (!tag) {
            return [];
          }

          return [
            {
              tag: tag._id,
              order: item.order,
            },
          ];
        },
      );

      highlightedTagsObjectResolved = await Promise.all(highlightedTagsObject);

      highlightedTagsObjectFinal = highlightedTagsObjectResolved.flat();

      if (!highlightedTagsObjectFinal) {
        return {
          errors: [
            {
              field: 'highlightedTags',
              message: 'Tags Ids are incorrect',
            },
          ],
        };
      }
    }

    const newData = {
      $set: {
        ...(title ? { title } : {}),
        ...(slug ? { slug } : {}),
        ...(tagline ? { tagline } : {}),
        ...(description ? { description } : {}),
        ...(logo ? { logo } : {}),
        ...(avatar && avatarObject ? { avatar: avatarObject?._id } : {}),
        ...(banner && bannerObject ? { banner: bannerObject?._id } : {}),
        ...(highlightedTags && highlightedTagsObject
          ? { highlightedTags: highlightedTagsObjectFinal }
          : {}),
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

  @FieldResolver(() => PaginatedPosts)
  async posts(
    @Root() community: Community,
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: Date | null,
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const cursorFilter = {
      ...(cursor
        ? {
            createdAt: {
              $lt: cursor,
            },
          }
        : {}),
    };

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const posts = await PostModel.find({
      community: community._doc._id,
      ...cursorFilter,
    })
      .sort({ createdAt: 'desc' })
      .limit(realLimitPlusOne)!;

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  @FieldResolver(() => [Role])
  async roles(@Root() community: Community): Promise<IRole[]> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await RoleModel.find({ community: community._doc._id }))!;
  }

  @FieldResolver(() => [Tag])
  async tags(
    @Root() community: Community,
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: Date | null,
  ): Promise<ITag[]> {
    const realLimit = Math.min(50, limit);

    const cursorFilter = {
      ...(cursor
        ? {
            createdAt: {
              $lt: cursor,
            },
          }
        : {}),
    };

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await TagModel.find({
      community: community._doc._id,
      ...cursorFilter,
    })
      .sort({ createdAt: 'asc' })
      .limit(realLimit))!;
  }

  @FieldResolver(() => [HighlightedTag])
  async highlightedTags(
    @Root() community: Community,
  ): Promise<IHighlightedTag[]> {
    const highlightedTagsObject: Promise<
      {
        tag: any;
        order: number;
      }[]
    >[] = community._doc.highlightedTags.flatMap(
      async function flatMapHighlightedTags(item: HighlightedTagInput) {
        const tag = await TagModel.findById(item.tag);

        if (!tag) {
          return [];
        }

        return [
          {
            tag,
            order: item.order,
          },
        ];
      },
    );

    const highlightedTagsObjectResolved = await Promise.all(
      highlightedTagsObject,
    );

    const orderedHighlightedTags = highlightedTagsObjectResolved
      .flat()
      .sort((a: any, b: any) => a.order - b.order);

    return orderedHighlightedTags;
  }

  @FieldResolver()
  async banner(@Root() community: Community): Promise<IMedia> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await MediaModel.findById(community._doc.banner))!;
  }

  @FieldResolver()
  async avatar(@Root() community: Community): Promise<IMedia> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await MediaModel.findById(community._doc.avatar))!;
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
