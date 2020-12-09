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
import { IUser } from '../../users/IUser';
import UserModel from '../../users/UserModel';
import CreatePostInput from '../inputs/CreatePostInput';
import UpdatePostInput from '../inputs/UpdatePostInput';
import IPost from '../IPost';
import PostModel from '../PostModel';
import Post from '../PostType';

@Resolver(_of => Post)
export default class PostResolver {
  @Query(() => [Post], { description: 'Queries all posts in database' })
  async findAllPosts(): Promise<IPost[]> {
    const posts = await PostModel.find();

    return posts;
  }

  @Query(() => Post, {
    nullable: true,
    description:
      'Queries an post by providing an email. If none is found, return null.',
  })
  async findPostById(@Arg('id') id: string): Promise<IPost | null> {
    return PostModel.findOne({ _id: new ObjectId(id) });
  }

  @Mutation(_returns => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('data') { title, slug, description, content }: CreatePostInput,
    // @Arg('creatorId', _type => ObjectIdScalar) creatorId: typeof ObjectId,
    @Ctx() { req }: ApolloContext,
  ): Promise<IPost> {
    const creator = req.user.id;

    const post = new PostModel({
      title,
      slug,
      description,
      content,
      creator,
    });

    await post.save();

    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id') id: string,
    @Arg('updateData') { title, slug, description, content }: UpdatePostInput,
  ): Promise<IPost | null> {
    const newData = {
      $set: {
        ...(title ? { title } : {}),
        ...(slug ? { slug } : {}),
        ...(description ? { description } : {}),
        ...(content ? { content } : {}),
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
      return null;
    }

    await post.save();

    return post;
  }

  @FieldResolver()
  async creator(@Root() post: Post): Promise<IUser> {
    return (await UserModel.findById(post._doc.creator))!;
  }
}
