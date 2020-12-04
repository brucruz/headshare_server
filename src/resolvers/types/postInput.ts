import { Post } from "src/models/Post";
import { InputType, Field } from "type-graphql";

@InputType()
export class CreatePostInput implements Partial<Post> {
  @Field(() => String, { description: 'Post title' })
  title: string;

  @Field(() => String, { description: 'Post content' })
  content: string;
}

@InputType()
export class UpdatePostInput implements Partial<Post> {
  @Field(() => String, { description: 'Post title', nullable: true })
  title?: string;

  @Field(() => String, { description: 'Post content', nullable: true })
  content?: string;
}
