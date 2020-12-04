import { ApolloServer } from "apollo-server-express";
import Express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import mongoose from 'mongoose';
import { HelloResolver } from "./resolvers/hello";
import { UserResolver } from "./resolvers/user";
import { PostResolver } from "./resolvers/post";


const main = async () => {
  const schema = await buildSchema({
    resolvers: [HelloResolver, UserResolver, PostResolver],
    emitSchemaFile: true,
    validate: false
  });

  await mongoose.connect('mongodb://localhost:27017/creators-communities-project', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.set('debug', true);
  mongoose.set('useFindAndModify', false);

  const apolloServer = new ApolloServer({
    schema,
  });
  const app = Express();
  apolloServer.applyMiddleware({ app });
  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready and listening at ==> http://localhost:4000${apolloServer.graphqlPath}`))
};

main().catch((error)=>{
  console.log(error, 'error');
});
