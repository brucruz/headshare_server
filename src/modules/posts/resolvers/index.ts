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
import ITag from '../../tags/ITag';
import TagModel from '../../tags/TagModel';
import { IUser } from '../../users/IUser';
import UserModel from '../../users/UserModel';
import CreatePostInput from '../inputs/CreatePostInput';
import UpdatePostInput from '../inputs/UpdatePostInput';
import PostModel from '../PostModel';
import Post from '../PostType';
import PostResponse from './PostResponse';
import PostsResponse from './PostsResponse';

@Resolver(_of => Post)
export default class PostResolver {
  @Query(() => PostsResponse, { description: 'Queries all posts in database' })
  async findAllPosts(): Promise<PostsResponse> {
    const posts = await PostModel.find();

    return { posts };
  }

  @Query(() => PostResponse, {
    nullable: true,
    description:
      'Queries an post by providing an email. If none is found, return null.',
  })
  async findPostById(@Arg('id') id: string): Promise<PostResponse> {
    const post = await PostModel.findOne({ _id: new ObjectId(id) });

    if (!post) {
      return {
        errors: [
          {
            field: 'id',
            message: 'No post found with the informed id',
          },
        ],
      };
    }
    return { post };
  }

  @Mutation(_returns => PostResponse)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('communitySlug') communitySlug: string,
    @Arg('data') { title, slug, description, content, tags }: CreatePostInput,
    @Ctx() { req }: ApolloContext,
  ): Promise<PostResponse> {
    const communityData = await CommunityModel.findOne({ slug: communitySlug });
    const community = communityData?._id;

    if (!community) {
      return {
        errors: [
          {
            field: 'community',
            message: 'You must be connected to a community to post',
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

    const checkCanonicalDuplicate = await PostModel.findOne({
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

    const post = new PostModel({
      title,
      slug,
      canonicalComponents,
      description,
      content,
      tags,
      creator,
      community,
    });

    await post.save();

    return { post };
  }

  @Mutation(() => PostResponse, { nullable: true })
  async updatePost(
    @Arg('communitySlug') communitySlug: string,
    @Arg('id') id: string,
    @Arg('updateData')
    { title, slug, description, content, tags }: UpdatePostInput,
  ): Promise<PostResponse> {
    const communityData = await CommunityModel.findOne({ slug: communitySlug });
    const community = communityData?._id;

    if (!community) {
      return {
        errors: [
          {
            field: 'community',
            message: 'You must be connected to a community to edit a post',
          },
        ],
      };
    }

    let canonicalComponents: string | undefined;

    if (slug) {
      canonicalComponents = `${communitySlug}/${slug}`;

      const checkCanonicalDuplicate = await PostModel.findOne({
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
        ...(content ? { content } : {}),
        ...(tags ? { tags } : {}),
      },
    };

    const post = await PostModel.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      { ...newData },
      {
        new: true,
      },
    );

    if (!post) {
      return {
        errors: [
          {
            field: 'id',
            message: 'No post found with the informed id',
          },
        ],
      };
    }

    await post.save();

    return { post };
  }

  @FieldResolver()
  async creator(@Root() post: Post): Promise<IUser> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await UserModel.findById(post._doc.creator))!;
  }

  @FieldResolver()
  async community(@Root() post: Post): Promise<ICommunity> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await CommunityModel.findById(post._doc.community))!;
  }

  @FieldResolver(() => [Post])
  async tags(@Root() post: Post): Promise<ITag[]> {
    const postTagsIds = post._doc.tags.map(tag => tag._id);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await TagModel.find({ _id: { $in: postTagsIds } }))!;
  }
}
