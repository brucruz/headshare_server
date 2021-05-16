import { Field, InputType } from 'type-graphql';
import { PostStatus } from '../IPost';

@InputType()
export default class UpdatePostInput {
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

  @Field(_type => String, {
    description: 'Post main media information',
    nullable: true,
  })
  mainMedia?: string;

  @Field(_type => String, {
    description: 'Post main media information',
    nullable: true,
  })
  cover?: string;

  @Field(() => Boolean, {
    description: 'If true, only exclusive members may view its content',
    nullable: true,
  })
  exclusive?: boolean;

  @Field(() => [String], {
    description: 'Post content',
    nullable: true,
  })
  tags?: any[];

  @Field(() => PostStatus, {
    description: 'created post status',
    nullable: true,
  })
  status?: PostStatus;
}
