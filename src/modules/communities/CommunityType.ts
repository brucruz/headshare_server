import { ObjectId } from 'mongodb';
import { Field, Int, ObjectType } from 'type-graphql';
import ObjectIdScalar from '../../type-graphql/ObjectIdScalar';
import Post from '../posts/PostType';
import Role from '../roles/RoleType';
import User from '../users/UserType';

@ObjectType({ description: 'The Communities model' })
export default class Community {
  @Field(() => ObjectIdScalar)
  readonly _id: typeof ObjectId;

  @Field(() => String, { description: 'Community title', nullable: true })
  logo?: string;

  @Field(() => String, { description: 'Community title' })
  title: string;

  @Field(() => String, { description: 'Community slug to use on url' })
  slug: string;

  @Field(() => String, { description: 'Community description', nullable: true })
  description?: string;

  @Field(() => [Post])
  posts: Post[];

  @Field(() => [Role])
  roles: Role[];

  @Field(() => User, { description: 'The user who created this community' })
  creator: User;

  @Field(() => Int, {
    description: 'The number of users following this community',
  })
  followersCount: number;

  @Field(() => Int, {
    description: 'The number of subscribed users in this community',
  })
  membersCount: number;

  _doc?: any;

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  removedAt: Date;

  @Field({ description: 'Community creation date' })
  createdAt: Date;

  @Field({ description: 'Community last update date', nullable: true })
  updatedAt: Date;
}
