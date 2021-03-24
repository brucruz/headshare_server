import DataLoader from 'dataloader';
import IPost from './IPost';
import PostModel from './PostModel';

const postLoader = (): DataLoader<any, IPost, any> =>
  new DataLoader<any, IPost>(async postIds => {
    const posts = await PostModel.find({
      _id: { $in: postIds },
    });

    console.log(posts);

    const postIdToPost: Record<any, IPost> = {};

    posts.forEach(post => {
      postIdToPost[post._id] = post;
    });

    return postIds.map(postId => postIdToPost[postId]);
  });

export default postLoader;
