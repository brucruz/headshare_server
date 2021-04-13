import { ApolloServer } from 'apollo-server-express';
import redis from 'redis';
import DataLoader from 'dataloader';
import schema from './graphql/schema';
import userLoader from './modules/users/userLoader';
import postLoader from './modules/posts/postLoader';

/* eslint-disable import/prefer-default-export */
export async function createApolloServer(): Promise<ApolloServer> {
  const apolloServer = new ApolloServer({
    schema: await schema,
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      userLoader: new DataLoader(userLoader),
      postLoader: new DataLoader(postLoader),
    }),
  });

  return apolloServer;
}
