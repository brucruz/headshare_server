import { Field, ObjectType } from 'type-graphql';
import { IUser } from '../IUser';
import User from '../UserType';
import FieldError from '../../shared/ErrorResponse';

@ObjectType()
export default class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: IUser;
}
