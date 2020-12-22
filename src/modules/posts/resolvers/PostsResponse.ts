import { Field, ObjectType } from 'type-graphql';
import IPost from '../IPost';
import Post from '../PostType';
import FieldError from '../../shared/ErrorResponse';

@ObjectType()
export default class PostsResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => [Post], { nullable: true })
  posts?: IPost[];
}
