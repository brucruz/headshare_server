import { mongoose } from "@typegoose/typegoose";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

import { Post, PostModel } from "../models/Post";
import { CreatePostInput, UpdatePostInput } from "./types/postInput";

@Resolver(_of => Post)
export class PostResolver {
  @Query(() => [Post], { description: 'Queries all posts in database' })
  async findAllPosts(): Promise<Post[]> {
    return PostModel.find();
  };

  @Query(() => Post, { nullable: true, description: 'Queries an post by providing an email. If none is found, return null.' })
  async findPostById(@Arg('id') id: string): Promise<Post | null> {
    return PostModel.findOne({ _id: new mongoose.Types.ObjectId(id) })
  }

  @Mutation(() => Post)
  async createPost(@Arg('data'){
    title,
    content,
  }: CreatePostInput): Promise<Post> { 
    const post = (await PostModel.create({
        title,
        content,
    })).save();

    return post;
  };

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id') id: string,
    @Arg('updateData'){
      title,
      content,
    }: UpdatePostInput
  ): Promise<Post | null> { 
    const newData = {
      $set: {
        ...(title ? { title } : {}),
        ...(content ? { content } : {}),
      }
    };

    const post = await PostModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
      }, { ...newData },
      {
        new: true,
      }
    );

    if (!post) {
      return null;
    }

    await post.save()

    return post;
  };
}
