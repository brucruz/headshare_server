import { ObjectId } from 'mongodb';
import { Field, ObjectType } from 'type-graphql';
import DateTimeScalar from '../../type-graphql/DateTimeScalar';
import ObjectIdScalar from '../../type-graphql/ObjectIdScalar';
import Community from '../communities/CommunityType';
import Media from '../medias/MediaType';
import PaginatedTags from '../tags/resolvers/PaginatedTags';
import User from '../users/UserType';
import { PostStatus } from './IPost';

@ObjectType({ description: 'The Posts model' })
export default class Post {
  @Field(() => ObjectIdScalar)
  readonly _id: typeof ObjectId;

  @Field(() => String, { description: 'Post title', nullable: true })
  title?: string;

  @Field(() => String, {
    description: 'Post title with h1 tags',
    nullable: true,
  })
  formattedTitle?: string;

  @Field(() => String, {
    description: 'Post slug to use on url',
    nullable: true,
  })
  slug?: string;

  @Field(() => String, {
    description:
      'Post unique slug, combining the post slug with its community to use on url',
    nullable: true,
  })
  canonicalComponents?: string;

  @Field(() => String, { description: 'Post description', nullable: true })
  description?: string;

  @Field(() => PostStatus, {
    description: 'created post status',
    defaultValue: 'draft',
  })
  status: PostStatus;

  @Field(_type => Media, {
    description: 'Post main media information',
    nullable: true,
  })
  mainMedia?: Media;

  @Field(_type => Media, {
    description: 'Post cover media',
    nullable: true,
  })
  cover?: Media;

  @Field(() => String, { description: 'Post content', nullable: true })
  content?: string;

  @Field(() => Boolean, {
    description: 'True if only exclusive members can access its content',
    defaultValue: false,
  })
  exclusive: boolean;

  @Field(() => Number, {
    description: 'Number of likes this post has received',
    defaultValue: 0,
  })
  likes: number;

  @Field(_type => User)
  creator: ObjectId;

  @Field(_type => Community)
  community: ObjectId;

  @Field(() => PaginatedTags)
  tags: PaginatedTags;

  _doc?: any;

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => DateTimeScalar, { nullable: true })
  removedAt: Date;

  @Field(() => DateTimeScalar, { description: 'Post creation date' })
  createdAt: Date;

  @Field(() => DateTimeScalar, {
    description: 'Post last update date',
    nullable: true,
  })
  updatedAt: Date;
}
