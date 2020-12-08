import { Field, InputType } from "type-graphql";
import { Post } from "../PostType";

@InputType()
export class UpdatePostInput implements Partial<Post> {
  @Field(() => String, { description: 'Post title', nullable: true })
  title?: string;

  @Field(() => String, { description: 'Post content', nullable: true })
  content?: string;
}
