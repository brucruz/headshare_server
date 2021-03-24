import { Field, ObjectType } from 'type-graphql';
import FieldError from '../../shared/ErrorResponse';
import PaginatedTags from './PaginatedTags';

@ObjectType()
export default class TagsResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => PaginatedTags, { nullable: true })
  paginatedTags?: PaginatedTags;
}
