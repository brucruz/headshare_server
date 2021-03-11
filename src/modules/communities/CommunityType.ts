import { ObjectId } from 'mongodb';
import { Field, Int, ObjectType } from 'type-graphql';
import DateTimeScalar from '../../type-graphql/DateTimeScalar';
import ObjectIdScalar from '../../type-graphql/ObjectIdScalar';
import Media from '../medias/MediaType';
import Post from '../posts/PostType';
import Role from '../roles/RoleType';
import Tag from '../tags/TagType';
import User from '../users/UserType';
import HighlightedTag from './HighlightTagType';

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

  @Field(() => Media, {
    description: 'Community avatar used to visually identify community info',
    nullable: true,
  })
  avatar?: Media;

  @Field(() => Media, {
    description: 'Community image banner to be displayed in its homepage',
    nullable: true,
  })
  banner?: Media;

  @Field(() => [Post])
  posts: Post[];

  @Field(() => [Tag], {
    description: 'All the tags associated with this community',
  })
  tags: Tag[];

  @Field(() => [HighlightedTag], {
    description:
      'Owner selected tags to appear on community home, given a specific order',
  })
  highlightedTags: HighlightedTag[];

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

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => DateTimeScalar, { nullable: true })
  removedAt: Date;

  @Field(() => DateTimeScalar, { description: 'Community creation date' })
  createdAt: Date;

  @Field(() => DateTimeScalar, {
    description: 'Community last update date',
    nullable: true,
  })
  updatedAt: Date;
}
