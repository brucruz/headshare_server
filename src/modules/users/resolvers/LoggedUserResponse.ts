/* eslint-disable max-classes-per-file */
import { Field, ObjectType } from 'type-graphql';
import { IUser } from '../IUser';
import FieldError from '../../shared/ErrorResponse';
import User from '../UserType';

@ObjectType()
export default class LoggedUserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: IUser;
}
