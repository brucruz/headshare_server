import { ObjectId } from 'mongodb';
import { Field, ObjectType } from 'type-graphql';
import ObjectIdScalar from '../../type-graphql/ObjectIdScalar';
import Community from '../communities/CommunityType';
import Post from '../posts/PostType';

@ObjectType({ description: 'The Tags model' })
export default class Tag {
  @Field(() => ObjectIdScalar)
  readonly _id: typeof ObjectId;

  @Field(() => String, { description: 'Tag title' })
  title: string;

  @Field(() => String, { description: 'Tag slug to use on url' })
  slug: string;

  @Field(() => String, {
    description:
      'Tag unique slug, combining the tag slug with its community to use on url',
  })
  canonicalComponents: string;

  @Field(() => String, { description: 'Tag description', nullable: true })
  description?: string;

  @Field(_type => Community)
  community: ObjectId;

  @Field(() => [Post])
  posts: Post[];

  _doc?: any;

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  removedAt: Date;

  @Field({ description: 'Tag creation date' })
  createdAt: Date;

  @Field({ description: 'Tag last update date', nullable: true })
  updatedAt: Date;
}
