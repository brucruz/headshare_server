import { Field, InputType } from 'type-graphql';
import { PostStatus } from '../IPost';

@InputType()
export default class PostOptionsInput {
  @Field(() => PostStatus, {
    description: 'Specifies which post status should be retrieved',
    nullable: true,
  })
  status?: PostStatus;
}
