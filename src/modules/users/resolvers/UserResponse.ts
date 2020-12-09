/* eslint-disable max-classes-per-file */
import { Field, ObjectType } from 'type-graphql';
import { IUser } from '../IUser';
import User from '../UserType';

@ObjectType()
export class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
export default class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: IUser;

  @Field(() => String, { nullable: true })
  token?: string;
}
