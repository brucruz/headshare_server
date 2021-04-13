/* eslint-disable @typescript-eslint/no-explicit-any */
import { BatchLoadFn } from 'dataloader';
import IPost from './IPost';
import PostModel from './PostModel';

const postLoader: BatchLoadFn<any, IPost> = async postIds => {
  const posts = await PostModel.find({
    _id: { $in: postIds },
  });

  const postIdToPost: Record<any, IPost> = {};

  posts.forEach(post => {
    postIdToPost[post._id] = post;
  });

  return postIds.map(postId => postIdToPost[postId]);
};

export default postLoader;
