import { ObjectId } from 'mongodb';
import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Root,
  FieldResolver,
  Ctx,
  Int,
} from 'type-graphql';
import { ApolloContext } from '../../../apollo-server/ApolloContext';
import CommunityModel from '../../communities/CommunityModel';
import ICommunity from '../../communities/ICommunity';
import PostModel from '../../posts/PostModel';
import RoleModel from '../../roles/RoleModel';
import CreateTagInput from '../inputs/CreateTagInput';
import FindByTagsInput from '../inputs/FindByTagsInput';
import FindByUserInput from '../inputs/FindByUserInput';
import UpdateTagInput from '../inputs/UpdateTagInput';
import TagModel from '../TagModel';
import Tag from '../TagType';
import TagResponse from './TagResponse';
import TagsResponse from './TagsResponse';
import transformSlug from '../../../utils/transformSlug';
import PostOptionsInput from '../../posts/inputs/PostOptionsInput';
import SuccessResponse from '../../shared/SuccessResponse';
import PaginatedPosts from '../../posts/resolvers/PaginatedPosts';
import getPostOptions from '../../posts/getPostOptions';
import TagOptionsInput from '../inputs/TagOptionsInput';
import getTagOptions from '../getTagOptions';

@Resolver(_of => Tag)
export default class TagResolver {
  @Query(() => TagsResponse, { description: 'Queries all tags in database' })
  async tags(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: Date | null,
    @Arg('tagOptions', () => TagOptionsInput, { nullable: true })
    tagOptions: TagOptionsInput,
  ): Promise<TagsResponse> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const cursorFilter = {
      ...(cursor
        ? {
            createdAt: {
              $gt: cursor,
            },
          }
        : {}),
    };

    const optionsFilter = tagOptions && getTagOptions(tagOptions);

    const tags = await TagModel.find({ ...cursorFilter, ...optionsFilter })
      .sort({ createdAt: 'asc' })
      .limit(realLimitPlusOne);

    return {
      paginatedTags: {
        tags: tags.slice(0, realLimit),
        hasMore: tags.length === realLimitPlusOne,
      },
    };
  }

  @Query(() => TagResponse, {
    description:
      'Queries an tag by providing an email. If none is found, return null.',
  })
  async tag(@Arg('id', () => String) id: string): Promise<TagResponse> {
    const tag = await TagModel.findOne({ _id: new ObjectId(id) });

    if (!tag) {
      return {
        errors: [
          {
            field: 'id',
            message: 'No Tag found with the informed id',
          },
        ],
      };
    }
    return { tag };
  }

  @Query(() => TagResponse, {
    description:
      'Queries an tag by providing an slug. If none is found, return null.',
  })
  async findTagBySlug(
    @Arg('slug', () => String) slug: string,
  ): Promise<TagResponse> {
    const tag = await TagModel.findOne({ slug });

    if (!tag) {
      return {
        errors: [
          {
            field: 'slug',
            message: 'No Tag found with the informed slug',
          },
        ],
      };
    }
    return { tag };
  }

  @Query(() => TagResponse, {
    description:
      'Queries an tag by providing slugs. If none is found, return null.',
  })
  async findTagBySlugs(
    @Arg('data', () => FindByTagsInput)
    { communitySlug, tagSlug }: FindByTagsInput,
  ): Promise<TagResponse> {
    const community = await CommunityModel.findOne({ slug: communitySlug });

    if (!community) {
      return {
        errors: [
          {
            field: 'communitySlug',
            message: 'No community found with the informed slug',
          },
        ],
      };
    }

    const tag = await TagModel.findOne({
      slug: tagSlug,
      community: community._id,
    });

    if (!tag) {
      return {
        errors: [
          {
            field: 'slug',
            message: 'No Tag found with the informed slug',
          },
        ],
      };
    }
    return { tag };
  }

  @Query(() => TagsResponse, {
    description:
      'Queries an tag by providing an user input. If none is found, return null.',
  })
  async findTagsByInput(
    @Arg('data', () => FindByUserInput)
    { communitySlug, userInput }: FindByUserInput,
  ): Promise<TagsResponse> {
    const community = await CommunityModel.findOne({ slug: communitySlug });

    if (!community) {
      return {
        errors: [
          {
            field: 'communitySlug',
            message: 'No community found with the informed slug',
          },
        ],
      };
    }

    const tags = await TagModel.find({
      title: { $regex: new RegExp(userInput, 'i') },
      community: community._id,
    });

    if (tags.length < 1) {
      return {
        errors: [
          {
            field: 'slug',
            message: 'No Tag found with the informed slug',
          },
        ],
      };
    }
    return {
      paginatedTags: {
        tags,
        hasMore: false,
      },
    };
  }

  @Mutation(_returns => TagResponse)
  async createTag(
    @Arg('communitySlug', () => String) communitySlug: string,
    @Arg('data', () => CreateTagInput)
    { title, slug: slugInput, description }: CreateTagInput,
    @Ctx() { req }: ApolloContext,
  ): Promise<TagResponse> {
    const communityData = await CommunityModel.findOne({ slug: communitySlug });
    const community = communityData?._id;

    if (!community) {
      return {
        errors: [
          {
            field: 'community',
            message: 'You must be connected to a community to create a tag',
          },
        ],
      };
    }

    const creator = req.session.userId;

    if (!creator) {
      return {
        errors: [
          {
            field: 'id',
            message: 'You must be logged in to perform this action',
          },
        ],
      };
    }

    const isCreator = await RoleModel.isCreator(creator, community);

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

    const slug = slugInput || transformSlug(title);

    const canonicalComponents = `${communitySlug}/${slug}`;

    const checkCanonicalDuplicate = await TagModel.findOne({
      canonicalComponents,
    });

    if (checkCanonicalDuplicate) {
      return {
        errors: [
          {
            field: 'slug',
            message: 'This slug was already created for this community',
          },
        ],
      };
    }

    const tag = new TagModel({
      title,
      slug,
      canonicalComponents,
      description,
      creator,
      community,
    });

    await tag.save();

    return { tag };
  }

  @Mutation(() => TagResponse, { nullable: true })
  async updateTag(
    @Arg('communitySlug', () => String) communitySlug: string,
    @Arg('id', () => String) id: string,
    @Arg('updateData', () => UpdateTagInput)
    { title, slug, description }: UpdateTagInput,
    @Ctx() { req }: ApolloContext,
  ): Promise<TagResponse> {
    const communityData = await CommunityModel.findOne({ slug: communitySlug });
    const community = communityData?._id;

    if (!community) {
      return {
        errors: [
          {
            field: 'community',
            message: 'You must be connected to a community to edit a Tag',
          },
        ],
      };
    }

    const { userId } = req.session;

    if (!userId) {
      return {
        errors: [
          {
            field: 'id',
            message: 'You must be logged in to perform this action',
          },
        ],
      };
    }

    const isCreator = await RoleModel.isCreator(userId, community);

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

    let canonicalComponents: string | undefined;

    if (slug) {
      canonicalComponents = `${communitySlug}/${slug}`;

      const checkCanonicalDuplicate = await TagModel.findOne({
        canonicalComponents,
      });

      const oldSlugEqualNew = checkCanonicalDuplicate?.slug === slug;

      if (checkCanonicalDuplicate && !oldSlugEqualNew) {
        return {
          errors: [
            {
              field: 'slug',
              message: 'There is already a slug created for this community',
            },
          ],
        };
      }
    }

    const newData = {
      $set: {
        ...(title ? { title } : {}),
        ...(slug ? { slug } : {}),
        ...(canonicalComponents ? { canonicalComponents } : {}),
        ...(description ? { description } : {}),
      },
    };

    const tag = await TagModel.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      { ...newData },
      {
        new: true,
      },
    );

    if (!tag) {
      return {
        errors: [
          {
            field: 'id',
            message: 'No Tag found with the informed id',
          },
        ],
      };
    }

    await tag.save();

    return { tag };
  }

  @Mutation(() => SuccessResponse, { description: 'Owners may ' })
  async deleteTag(
    @Arg('communitySlug', () => String) communitySlug: string,
    @Arg('tagId', () => String) tagId: string,
    @Ctx() { req }: ApolloContext,
  ): Promise<SuccessResponse> {
    const communityData = await CommunityModel.findOne({ slug: communitySlug });
    const community = communityData?._id;

    if (!community) {
      return {
        errors: [
          {
            field: 'community',
            message:
              'You must be connected to a community to perform this action',
          },
        ],
        success: false,
      };
    }

    const creator = req.session.userId;

    if (!creator) {
      return {
        errors: [
          {
            field: 'auth',
            message: 'You must be logged in to perform this action',
          },
        ],
        success: false,
      };
    }

    const isCreator = await RoleModel.isCreator(creator, community);

    if (!isCreator) {
      return {
        errors: [
          {
            field: 'role',
            message: 'Only community creators may perform this action',
          },
        ],
        success: false,
      };
    }

    const tag = await TagModel.findByIdAndDelete(tagId);

    if (!tag) {
      return {
        errors: [
          {
            field: 'tagId',
            message: 'Tag not found with the informed id',
          },
        ],
        success: false,
      };
    }

    return {
      success: true,
    };
  }

  @FieldResolver(() => PaginatedPosts)
  async posts(
    @Root() tag: Tag,
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: Date | null,
    @Arg('postOptions', () => PostOptionsInput, { nullable: true })
    options?: PostOptionsInput,
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    let filters: PostOptionsInput = {};

    const allFilters = options && getPostOptions(options);

    if (allFilters) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { tags, ...newFilters } = allFilters;

      filters = newFilters;
    }

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
    const posts = (await PostModel.find({
      tags: tag._doc._id,
      ...cursorFilter,
      ...filters,
    })
      .sort({ createdAt: 'desc' })
      .limit(realLimitPlusOne))!;

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  @FieldResolver()
  async community(@Root() tag: Tag): Promise<ICommunity> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await CommunityModel.findById(tag._doc.community))!;
  }

  @FieldResolver(() => Int)
  async postCount(
    @Root() tag: Tag,
    @Arg('postOptions', () => PostOptionsInput, { nullable: true })
    options?: PostOptionsInput,
  ): Promise<number> {
    let filters: PostOptionsInput = {};

    const allFilters = options && getPostOptions(options);

    if (allFilters) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { tags, ...newFilters } = allFilters;

      filters = newFilters;
    }

    return PostModel.countDocuments(
      { tags: tag._doc._id, ...filters },
      function countPosts(err, count) {
        if (err) {
          return 0;
        }
        return count;
      },
    );
  }
}
