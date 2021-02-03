import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import 'reflect-metadata';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';

import schema from './graphql/schema';

const main = async () => {
  const mongodbUsername = process.env.MONGODB_USERNAME;
  const mongodbPassword = process.env.MONGODB_PASSWORD;
  const mongodbCredentials =
    mongodbUsername && mongodbPassword
      ? encodeURI(`${mongodbUsername}:${mongodbPassword}@`)
      : '';
  const mongodbHost = process.env.MONGODB_HOST || 'localhost';
  const mongodbPort = process.env.MONGODB_PORT || '27017';
  const mongodbDatabase = process.env.MONGODB_DATABASE || 'headshare';

  await mongoose.connect(
    `mongodb://${mongodbCredentials}${mongodbHost}:${mongodbPort}/${mongodbDatabase}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
  );

  mongoose.set('debug', true);

  const apolloServer = new ApolloServer({
    schema: await schema,
    context: ({ req, res }) => ({ req, res }),
  });
  const app = Express();

  app.set('trust proxy', 1);
  app.use(
    cors({
      origin: process.env.APP_WEB_URL,
      credentials: true,
    }),
  );

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient({
    password:
      process.env.REDIS_PASSWORD === ''
        ? undefined
        : process.env.REDIS_PASSWORD,
    // eslint-disable-next-line radix
    port: parseInt(process.env.REDIS_PORT || '6379'),
  });

  app.use(
    session({
      name: 'qid',
      store: new RedisStore({
        client: redisClient,
      }),
      secret: process.env.APP_SECRET || 'very-secret-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.ENVIRONMENT === 'production', // cookie only works in https
      },
    }),
  );

  apolloServer.applyMiddleware({ app, cors: false });

  // eslint-disable-next-line radix
  app.listen({ port: parseInt(process.env.PORT || '4000') }, () =>
    console.log(
      `🚀 Server ready and listening at ==> ${process.env.APP_HOST}:${process.env.PORT}${apolloServer.graphqlPath}`,
    ),
  );
};

main().catch(error => {
  console.log(error, 'error');
});
