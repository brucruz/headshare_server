import { Field, InputType } from "type-graphql";
import { Post } from "../PostType";

@InputType()
export class CreatePostInput implements Partial<Post> {
  @Field(() => String, { description: 'Post title' })
  title: string;

  @Field(() => String, { description: 'Post content' })
  content: string;
}
