import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import 'reflect-metadata';
import mongoose from 'mongoose';
import 'dotenv/config';
import schema from './graphql/schema';

const main = async () => {
  await mongoose.connect(
    'mongodb://localhost:27017/creators-communities-project',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
  );

  mongoose.set('debug', true);
  mongoose.set('useFindAndModify', false);

  const apolloServer = new ApolloServer({
    schema: await schema,
    context: ({ req, res }) => ({ req, res }),
  });
  const app = Express();
  apolloServer.applyMiddleware({ app });
  app.listen({ port: 4000 }, () =>
    console.log(
      `🚀 Server ready and listening at ==> http://localhost:4000${apolloServer.graphqlPath}`,
    ),
  );
};

main().catch(error => {
  console.log(error, 'error');
});
