import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class ErrorResponse {
  @Field(() => String)
  field: string;

  @Field(() => String)
  message: string;
}
