/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import DataLoader from 'dataloader';
import { IUser } from '../modules/users/IUser';
import IPost from '../modules/posts/IPost';

export interface ApolloContext {
  req: Request;
  res: Response;
  // userLoader: ReturnType<typeof userLoader>;
  // postLoader: ReturnType<typeof postLoader>;
  userLoader: DataLoader<any, IUser, any>;
  postLoader: DataLoader<any, IPost, any>;
}
