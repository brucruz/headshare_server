import 'reflect-metadata';
import { ApolloServerBase, Config } from 'apollo-server-core';
import DataLoader from 'dataloader';
import mongoose, { ConnectOptions } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import redis from 'redis';
import schema from '../graphql/schema';
import postLoader from '../modules/posts/postLoader';
import userLoader from '../modules/users/userLoader';
import { restartCounters, startCounters } from './createRows';

const mongod = new MongoMemoryServer();

async function getMongoMemoryUri() {
  const uri = await mongod.getUri();

  return uri;
}

// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
// jest does this automatically for you if no NODE_ENV is set
process.env.NODE_ENV = 'test';

const mongooseOptions: ConnectOptions = {
  autoIndex: false,
  autoReconnect: false,
  connectTimeoutMS: 10000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

// Just in case want to debug something
// mongoose.set('debug', true);

export async function connectMongoose(): Promise<typeof mongoose | void> {
  // jest.setTimeout(20000);
  startCounters();

  // return mongoose.connect(global.__MONGO_URI__, {

  await mongoose.connect(
    // 'mongodb://localhost:27017/test-creators-communities-project',
    await getMongoMemoryUri(),
    {
      ...mongooseOptions,
      // dbName: global.__MONGO_DB_NAME__,
    },
  );
}

export async function clearDatabase(): Promise<void> {
  await mongoose.connection.db.dropDatabase();
}

export async function disconnectMongoose(): Promise<void> {
  await mongoose.disconnect();

  await mongod.stop();
  // mongoose.connections.forEach(connection => {
  //   const modelNames = Object.keys(connection.models);

  //   modelNames.forEach(modelName => {
  //     delete connection.models[modelName];
  //   });

  //   const collectionNames = Object.keys(connection.collections);
  //   collectionNames.forEach(collectionName => {
  //     delete connection.collections[collectionName];
  //   });
  // });

  // const modelSchemaNames = Object.keys(mongoose.modelSchemas);
  // modelSchemaNames.forEach(modelSchemaName => {
  //   delete mongoose.modelSchemas[modelSchemaName];
  // });
}

export async function clearDbAndRestartCounters(): Promise<void> {
  await clearDatabase();
  restartCounters();
}

const getTestServer = async (userId = ''): Promise<() => ApolloServerBase> => {
  const config: Config = {
    schema: await schema,
    context: ({ req, res }) => ({
      req: {
        ...req,
        session: { userId },
      },
      res,
      redis,
      userLoader: new DataLoader(userLoader),
      postLoader: new DataLoader(postLoader),
    }),
  };

  const server: () => ApolloServerBase = () => new ApolloServerBase(config);

  return server;
};

export default getTestServer;
