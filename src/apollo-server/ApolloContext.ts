import { Request, Response } from 'express';
import userLoader from '../modules/users/userLoader';
import postLoader from '../modules/posts/postLoader';

export interface ApolloContext {
  req: Request;
  res: Response;
  userLoader: ReturnType<typeof userLoader>;
  postLoader: ReturnType<typeof postLoader>;
}
