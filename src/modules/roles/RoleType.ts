import { ObjectId } from 'mongodb';
import { Field, ObjectType } from 'type-graphql';
import DateTimeScalar from '../../type-graphql/DateTimeScalar';
import ObjectIdScalar from '../../type-graphql/ObjectIdScalar';
import Community from '../communities/CommunityType';
import User from '../users/UserType';
import { RoleOptions } from './IRole';

@ObjectType({ description: 'The Roles model' })
export default class Role {
  @Field(() => ObjectIdScalar)
  readonly _id: ObjectId;

  @Field(() => RoleOptions, { description: 'User role in community' })
  role: RoleOptions;

  @Field(() => User)
  user: User;

  @Field(() => Community)
  community: Community;

  _doc?: any;

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => DateTimeScalar, { nullable: true })
  removedAt?: Date;

  @Field(() => DateTimeScalar, { description: 'User creation date' })
  createdAt: Date;

  @Field(() => DateTimeScalar, {
    description: 'User last update date',
    nullable: true,
  })
  updatedAt: Date;
}
