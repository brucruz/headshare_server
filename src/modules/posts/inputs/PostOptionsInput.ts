import { Field, InputType } from 'type-graphql';
import { PostStatus } from '../IPost';

@InputType()
export default class PostOptionsInput {
  @Field(() => PostStatus, {
    description: 'Specifies which post status should be retrieved',
    nullable: true,
  })
  status?: PostStatus;

  @Field(() => String, {
    description: 'Specifies the community id',
    nullable: true,
  })
  communityId?: any;

  @Field(() => [String], {
    description: 'Specifies the tag ids',
    nullable: true,
  })
  tagIds?: any[];
}
