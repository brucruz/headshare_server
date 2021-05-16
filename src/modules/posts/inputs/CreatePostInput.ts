import { ObjectId } from 'mongoose';
import { Field, InputType } from 'type-graphql';
import ObjectIdScalar from '../../../type-graphql/ObjectIdScalar';

@InputType()
export default class CreatePostInput {
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

  @Field(() => String, { description: 'Post description', nullable: true })
  description?: string;

  @Field(() => String, { description: 'Post content', nullable: true })
  content?: string;

  @Field(_type => ObjectIdScalar, {
    description: 'Post main media information',
    nullable: true,
  })
  mainMedia?: ObjectId;

  @Field(_type => ObjectIdScalar, {
    description: 'Post cover information',
    nullable: true,
  })
  cover?: ObjectId;

  @Field(() => Boolean, {
    description: 'If true, only exclusive members may view its content',
    nullable: true,
  })
  exclusive?: boolean;

  @Field(() => [ObjectIdScalar], {
    description: 'Post content',
    nullable: true,
  })
  tags?: string[];
}
