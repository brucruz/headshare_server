import { Field, ObjectType } from 'type-graphql';
import FieldError from './ErrorResponse';

@ObjectType()
export default class SuccessResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Boolean)
  success: boolean;
}
