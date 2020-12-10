import { buildSchema } from 'type-graphql';
import path from 'path';
import mongoose from 'mongoose';
// import CommunityResolver from '../modules/communities/resolvers';
// import PostResolver from '../modules/posts/resolvers';
import UserResolver from '../modules/users/resolvers';
import ObjectIdScalar from '../type-graphql/ObjectIdScalar';

const { ObjectId } = mongoose.Schema.Types;

const schema = buildSchema({
  resolvers: [UserResolver],
  emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
  scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
  validate: false,
});

export default schema;
