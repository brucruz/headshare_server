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
import transformSlug from '../../../utils/transformSlug';
import CommunityModel from '../../communities/CommunityModel';
import ICommunity from '../../communities/ICommunity';
import IMedia from '../../medias/IMedia';
import MediaModel from '../../medias/MediaModel';
import FileType from '../../medias/FileType';
import UpdateMediaInput from '../../medias/resolvers/input/UpdateMediaInput';
import RoleModel from '../../roles/RoleModel';
import TagModel from '../../tags/TagModel';
import { IUser } from '../../users/IUser';
import CreatePostInput from '../inputs/CreatePostInput';
import FindBySlugsInput from '../inputs/FindBySlugsInput';
import UpdatePostInput from '../inputs/UpdatePostInput';
import { PostStatus } from '../IPost';
import PostModel from '../PostModel';
import Post from '../PostType';
import PostResponse from './PostResponse';
import PostsResponse from './PostsResponse';
import SuccessResponse from '../../shared/SuccessResponse';
import PostOptionsInput from '../inputs/PostOptionsInput';
import UploadImageInput from '../../medias/resolvers/input/UploadImageInput';
import getPostOptions from '../getPostOptions';
import PaginatedTags from '../../tags/resolvers/PaginatedTags';
import TagOptionsInput from '../../tags/inputs/TagOptionsInput';
import getTagOptions from '../../tags/getTagOptions';
import { isCreator as _isCreator } from '../../shared/errors/isCreator';
import { uploadImage } from '../../medias/uploadImage';

@Resolver(_of => Post)
export default class PostResolver {
  @Query(() => PostsResponse, { description: 'Queries all posts in database' })
  async posts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: Date | null,
    @Arg('postOptions', () => PostOptionsInput, { nullable: true })
    postOptions: PostOptionsInput,
  ): Promise<PostsResponse> {
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

    const optionsFilter = postOptions && getPostOptions(postOptions);

    const posts = await PostModel.find({ ...cursorFilter, ...optionsFilter })
      .sort({ createdAt: 'desc' })
      .limit(realLimitPlusOne);

    return {
      paginatedPosts: {
        posts: posts.slice(0, realLimit),
        hasMore: posts.length === realLimitPlusOne,
      },
    };
  }

  @Query(() => PostsResponse, { description: 'Queries all posts in database' })
  async allPosts(
    @Arg('postOptions', () => PostOptionsInput, { nullable: true })
    options: PostOptionsInput,
  ): Promise<PostsResponse> {
    const filters = options && getPostOptions(options);

    const posts = await PostModel.find({
      ...filters,
    });

    return {
      paginatedPosts: {
        posts,
        hasMore: false,
      },
    };
  }

  @Query(() => PostResponse, {
    nullable: true,
    description:
      'Queries an post by providing an email. If none is found, return null.',
  })
  async findPostById(
    @Arg('id', () => String) id: string,
  ): Promise<PostResponse> {
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

  @Query(() => PostResponse, {
    description:
      'Queries a post by providing community and post slugs. If none is found, return null.',
  })
  async findPostBySlugs(
    @Arg('data', () => FindBySlugsInput)
    { communitySlug, postSlug }: FindBySlugsInput,
  ): Promise<PostResponse> {
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

    const post = await PostModel.findOne({
      slug: postSlug,
      community: community._id,
    });

    if (!post) {
      return {
        errors: [
          {
            field: 'slug',
            message: 'No post found with the informed slug',
          },
        ],
      };
    }
    return { post };
  }

  @Mutation(_returns => PostResponse)
  async createPost(
    @Arg('communitySlug', () => String) communitySlug: string,
    @Arg('data', () => CreatePostInput)
    {
      title,
      formattedTitle,
      exclusive,
      mainMedia,
      slug,
      description,
      content,
      tags,
    }: CreatePostInput,
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

    const canonicalComponents = slug && `${communitySlug}/${slug}`;

    const checkCanonicalDuplicate =
      slug &&
      (await PostModel.findOne({
        canonicalComponents,
      }));

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
      formattedTitle,
      exclusive,
      mainMedia,
      slug,
      canonicalComponents,
      description,
      content,
      status: PostStatus.DRAFT,
      tags,
      creator,
      community,
    });

    await post.save();

    return { post };
  }

  @Mutation(() => PostResponse, { nullable: true })
  async updatePost(
    @Arg('communitySlug', () => String) communitySlug: string,
    @Arg('id', () => String) id: string,
    @Arg('updateData', () => UpdatePostInput)
    {
      title,
      formattedTitle,
      slug: inputSlug,
      description,
      content,
      exclusive,
      status,
      tags,
      mainMedia,
      cover,
    }: UpdatePostInput,
    @Ctx() { req }: ApolloContext,
  ): Promise<PostResponse> {
    const communityData = await CommunityModel.findOne({ slug: communitySlug });
    const community = communityData?._id;

    let post = await PostModel.findById(id);

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

    const hasSlug = inputSlug || post.slug;

    const hasTitle = title || post.title;

    let slug: string | undefined;

    if (hasSlug) {
      slug = hasSlug;
    } else if (hasTitle) {
      slug = transformSlug(hasTitle);
    }

    const sameSlug = slug === post.slug;

    if (slug && !sameSlug) {
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

    let mainMediaObject;

    if (mainMedia) {
      mainMediaObject = await MediaModel.findById(mainMedia);

      if (!mainMediaObject) {
        return {
          errors: [
            {
              field: 'mainMedia',
              message: 'Media Id is incorrect',
            },
          ],
        };
      }
    }

    let coverObject;

    if (cover) {
      coverObject = await MediaModel.findById(cover);

      if (!coverObject) {
        return {
          errors: [
            {
              field: 'cover',
              message: 'Media Id is incorrect',
            },
          ],
        };
      }
    }

    let tagsIds;

    if (tags) {
      const returnedTags = await TagModel.find({ _id: { $in: tags } });

      if (returnedTags.length === 0) {
        return {
          errors: [
            {
              field: 'tags',
              message: 'Tag Id is incorrect',
            },
          ],
        };
      }

      tagsIds = returnedTags.map(tag => tag._id);
    }

    const newData = {
      $set: {
        ...(title ? { title } : {}),
        ...(slug ? { slug } : {}),
        ...(canonicalComponents ? { canonicalComponents } : {}),
        ...(description ? { description } : {}),
        ...(content ? { content } : {}),
        ...(formattedTitle ? { formattedTitle } : {}),
        ...(typeof exclusive !== 'undefined' ? { exclusive } : {}),
        ...(status ? { status } : {}),
        ...(tags ? { tags: tagsIds } : {}),
        ...(mainMedia && mainMediaObject
          ? { mainMedia: mainMediaObject._id }
          : {}),
        ...(cover && coverObject ? { cover: coverObject._id } : {}),
      },
    };

    post = await PostModel.findOneAndUpdate(
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

  @Mutation(() => PostResponse)
  async updatePostMainMedia(
    @Arg('communityId', () => String) communityId: string,
    @Arg('postId', () => String) postId: string,
    @Arg('mainMediaData', () => UpdateMediaInput)
    { name, description, file, url, thumbnailUrl, format }: UpdateMediaInput,
    @Ctx() { req }: ApolloContext,
  ): Promise<PostResponse> {
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

    const isCreator = await RoleModel.isCreator(userId, communityId);

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

    const post = await PostModel.findById(postId);

    if (!post) {
      return {
        errors: [
          {
            field: 'postId',
            message: 'Post inexistent',
          },
        ],
      };
    }

    if (!post.mainMedia) {
      return {
        errors: [
          {
            field: 'postMainMedia',
            message: 'Post main media inexistent',
          },
        ],
      };
    }

    const mainMedia = await MediaModel.findById(post.mainMedia);

    if (!mainMedia) {
      return {
        errors: [
          {
            field: 'mainMedia',
            message: 'Post main media inexistent',
          },
        ],
      };
    }

    const newFileData: FileType | undefined = file && {
      name: file.name || mainMedia.file.name,
      type: file.type || mainMedia.file.type,
      size: file.size || mainMedia.file.size,
      extension: file.extension || mainMedia.file.extension,
    };

    const newData = {
      $set: {
        ...(name && { name }),
        ...(description && { description }),
        ...(newFileData && { file: newFileData }),
        ...(url && { url }),
        ...(format && { format }),
        ...(thumbnailUrl && { thumbnailUrl }),
      },
    };

    await MediaModel.findOneAndUpdate(
      {
        _id: new ObjectId(post.mainMedia.toString()),
      },
      { ...newData },
      {
        new: true,
      },
    );

    return {
      post,
    };
  }

  @Mutation(() => PostResponse, {
    description: 'Users can remove main media from a post',
  })
  async deletePostMainMedia(
    @Arg('communitySlug', () => String) communitySlug: string,
    @Arg('postId', () => String) postId: string,
    @Ctx() { req }: ApolloContext,
  ): Promise<PostResponse> {
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

    try {
      const post = await PostModel.findById(postId);

      if (!post) {
        return {
          errors: [
            {
              field: 'postId',
              message: 'No post found with this Id',
            },
          ],
        };
      }

      post.mainMedia = undefined;

      await post.save();

      return {
        post: post || undefined,
      };
    } catch (err) {
      return {
        errors: [
          {
            field: 'none',
            message: err,
          },
        ],
      };
    }
  }

  @Mutation(() => SuccessResponse, { description: 'Owners may ' })
  async deletePost(
    @Arg('communitySlug', () => String) communitySlug: string,
    @Arg('postId', () => String) postId: string,
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

    const post = await PostModel.findByIdAndDelete(postId);

    if (!post) {
      return {
        errors: [
          {
            field: 'postId',
            message: 'Post not found with the informed id',
          },
        ],
        success: false,
      };
    }

    return {
      success: true,
    };
  }

  @Mutation(() => PostResponse, {
    description: 'Users can upload a image directly as a post main media',
  })
  async updatePostMainImage(
    @Arg('communitySlug', () => String) communitySlug: string,
    @Arg('postId', () => String) postId: string,
    @Arg('imageData', () => UploadImageInput)
    {
      format,
      thumbnailUrl,
      name,
      description,
      file,
      width,
      height,
    }: UploadImageInput,
    @Ctx() { req }: ApolloContext,
  ): Promise<PostResponse> {
    const communityData = await _isCreator(
      { slug: communitySlug },
      req.session.userId,
    );
    const community = communityData?._id;

    try {
      const media = await uploadImage(
        {
          format,
          thumbnailUrl,
          name,
          description,
          file,
          width,
          height,
        },
        community,
      );

      const post = await PostModel.findByIdAndUpdate(
        postId,
        {
          $set: {
            ...{ mainMedia: media._id },
          },
        },
        {
          new: true,
        },
      );

      return {
        post: post || undefined,
      };
    } catch (err) {
      return {
        errors: [
          {
            field: 'none',
            message: err,
          },
        ],
      };
    }
  }

  @Mutation(() => PostResponse, {
    description: 'Users can upload a image directly as a post cover',
  })
  async updatePostCover(
    @Arg('communitySlug', () => String) communitySlug: string,
    @Arg('postId', () => String) postId: string,
    @Arg('imageData', () => UploadImageInput)
    {
      format,
      thumbnailUrl,
      name,
      description,
      file,
      width,
      height,
    }: UploadImageInput,
    @Ctx() { req }: ApolloContext,
  ): Promise<PostResponse> {
    const communityData = await _isCreator(
      { slug: communitySlug },
      req.session.userId,
    );
    const community = communityData?._id;

    try {
      const media = await uploadImage(
        {
          format,
          thumbnailUrl,
          name,
          description,
          file,
          width,
          height,
        },
        community,
      );

      const post = await PostModel.findByIdAndUpdate(
        postId,
        {
          $set: {
            ...{ cover: media._id },
          },
        },
        {
          new: true,
        },
      );

      return {
        post: post || undefined,
      };
    } catch (err) {
      return {
        errors: [
          {
            field: 'none',
            message: err,
          },
        ],
      };
    }
  }

  @FieldResolver()
  async creator(
    @Root() post: Post,
    @Ctx() { userLoader }: ApolloContext,
  ): Promise<IUser> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    // return (await UserModel.findById(post._doc.creator))!;
    return userLoader.load(post._doc.creator);
  }

  @FieldResolver()
  async community(@Root() post: Post): Promise<ICommunity> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await CommunityModel.findById(post._doc.community))!;
  }

  @FieldResolver(() => PaginatedTags)
  async tags(
    @Root() post: Post,
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: Date | null,
    @Arg('tagOptions', () => TagOptionsInput, { nullable: true })
    options: TagOptionsInput,
  ): Promise<PaginatedTags> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const filters = options && getTagOptions(options);

    const cursorFilter = {
      ...(cursor
        ? {
            createdAt: {
              $lt: cursor,
            },
          }
        : {}),
    };

    const postTags = post._doc.tags;

    if (!postTags) {
      return {
        tags: [],
        hasMore: false,
      };
    }

    const postTagsIds = postTags.map((tag: any) => tag._id);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const tags = (await TagModel.find({
      _id: { $in: postTagsIds },
      ...cursorFilter,
      ...filters,
    })
      .sort({ createdAt: 'desc' })
      .limit(realLimitPlusOne))!;

    return {
      tags: tags.slice(0, realLimit),
      hasMore: tags.length === realLimitPlusOne,
    };
  }

  @FieldResolver()
  async mainMedia(@Root() post: Post): Promise<IMedia> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await MediaModel.findById(post._doc.mainMedia))!;
  }

  @FieldResolver()
  async cover(@Root() post: Post): Promise<IMedia> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await MediaModel.findById(post._doc.cover))!;
  }
}
