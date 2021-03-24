import { Field, ObjectType } from 'type-graphql';
import FieldError from '../../shared/ErrorResponse';
import PaginatedPosts from './PaginatedPosts';

@ObjectType()
export default class PostsResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => PaginatedPosts, { nullable: true })
  paginatedPosts?: PaginatedPosts;
}
