import { ObjectId } from 'mongodb';
import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Root,
  FieldResolver,
  UseMiddleware,
  Ctx,
} from 'type-graphql';
import { ApolloContext } from '../../../apollo-server/ApolloContext';
import isAuth from '../../../middlewares/isAuth';
import CommunityModel from '../../communities/CommunityModel';
import ICommunity from '../../communities/ICommunity';
import IPost from '../../posts/IPost';
import PostModel from '../../posts/PostModel';
import Post from '../../posts/PostType';
import CreateTagInput from '../inputs/CreateTagInput';
import UpdateTagInput from '../inputs/UpdateTagInput';
import TagModel from '../TagModel';
import Tag from '../TagType';
import TagResponse from './TagResponse';
import TagsResponse from './TagsResponse';

@Resolver(_of => Tag)
export default class TagResolver {
  @Query(() => TagsResponse, { description: 'Queries all tags in database' })
  async tags(): Promise<TagsResponse> {
    const tags = await TagModel.find({});

    return { tags };
  }

  @Query(() => TagResponse, {
    nullable: true,
    description:
      'Queries an tag by providing an email. If none is found, return null.',
  })
  async tag(@Arg('id') id: string): Promise<TagResponse> {
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
    nullable: true,
    description:
      'Queries an tag by providing an email. If none is found, return null.',
  })
  async findTagBySlug(@Arg('slug') slug: string): Promise<TagResponse> {
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

  @Mutation(_returns => TagResponse)
  @UseMiddleware(isAuth)
  async createTag(
    @Arg('communitySlug') communitySlug: string,
    @Arg('data') { title, slug, description }: CreateTagInput,
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

    const creator = req.user?.id;

    if (!creator) {
      return {
        errors: [
          {
            field: 'id',
            message: 'Invalid JWT token',
          },
        ],
      };
    }

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
    @Arg('communitySlug') communitySlug: string,
    @Arg('id') id: string,
    @Arg('updateData') { title, slug, description }: UpdateTagInput,
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

    let canonicalComponents: string | undefined;

    if (slug) {
      canonicalComponents = `${communitySlug}/${slug}`;

      const checkCanonicalDuplicate = await TagModel.findOne({
        canonicalComponents,
      });

      if (checkCanonicalDuplicate) {
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

  @FieldResolver(() => [Post])
  async posts(@Root() tag: Tag): Promise<IPost[]> {
    return (await PostModel.find({ tags: tag._doc._id }))!;
  }

  @FieldResolver()
  async community(@Root() tag: Tag): Promise<ICommunity> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await CommunityModel.findById(tag._doc.community))!;
  }
}
