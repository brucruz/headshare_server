import { Field, InputType } from 'type-graphql';
import Post from '../PostType';

@InputType()
export default class UpdatePostInput implements Partial<Post> {
  @Field(() => String, { description: 'Post title', nullable: true })
  title?: string;

  @Field(() => String, {
    description: 'Post slug to use on url',
    nullable: true,
  })
  slug?: string;

  @Field(() => String, { description: 'Post description', nullable: true })
  description?: string;

  @Field(() => String, { description: 'Post content', nullable: true })
  content?: string;
}
