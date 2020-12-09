import { Field, InputType } from 'type-graphql';
import Post from '../PostType';

@InputType()
export default class CreatePostInput implements Partial<Post> {
  @Field(() => String, { description: 'Post title' })
  title: string;

  @Field(() => String, { description: 'Post slug to use on url' })
  slug: string;

  @Field(() => String, { description: 'Post description', nullable: true })
  description?: string;

  @Field(() => String, { description: 'Post content' })
  content: string;
}
