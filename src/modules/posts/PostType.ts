import { ObjectId } from 'mongodb';
import { Field, ObjectType } from 'type-graphql';
import ObjectIdScalar from '../../type-graphql/ObjectIdScalar';
import Community from '../communities/CommunityType';
import Tag from '../tags/TagType';
import User from '../users/UserType';

@ObjectType({ description: 'The Posts model' })
export default class Post {
  @Field(() => ObjectIdScalar)
  readonly _id: typeof ObjectId;

  @Field(() => String, { description: 'Post title' })
  title: string;

  @Field(() => String, { description: 'Post slug to use on url' })
  slug: string;

  @Field(() => String, {
    description:
      'Post unique slug, combining the post slug with its community to use on url',
  })
  canonicalComponents: string;

  @Field(() => String, { description: 'Post description', nullable: true })
  description?: string;

  @Field({ description: 'Post content' })
  content: string;

  @Field({
    description: 'Number of likes this post has received',
    defaultValue: 0,
  })
  likes?: number;

  @Field(_type => User)
  creator: ObjectId;

  @Field(_type => Community)
  community: ObjectId;

  @Field(() => [Tag])
  tags: Tag[];

  _doc?: any;

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  removedAt: Date;

  @Field({ description: 'Post creation date' })
  createdAt: Date;

  @Field({ description: 'Post last update date', nullable: true })
  updatedAt: Date;
}
