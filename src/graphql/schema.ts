import { buildSchema } from 'type-graphql';
import path from 'path';
import mongoose from 'mongoose';
import CommunityResolver from '../modules/communities/resolvers';
import PostResolver from '../modules/posts/resolvers';
import UserResolver from '../modules/users/resolvers';
import ObjectIdScalar from '../type-graphql/ObjectIdScalar';
import DateTimeScalar from '../type-graphql/DateTimeScalar';
import TagResolver from '../modules/tags/resolvers';
import RoleResolver from '../modules/roles/resolvers';
import MediaResolver from '../modules/medias/resolvers';
import CardResolver from '../modules/cards/resolvers';

const { ObjectId } = mongoose.Schema.Types;

const schema = buildSchema({
  resolvers: [
    UserResolver,
    PostResolver,
    CommunityResolver,
    TagResolver,
    RoleResolver,
    MediaResolver,
    CardResolver,
  ],
  emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
  // dateScalarMode: 'isoDate',
  scalarsMap: [
    { type: ObjectId, scalar: ObjectIdScalar },
    { type: Date, scalar: DateTimeScalar },
  ],
  validate: false,
});

export default schema;
