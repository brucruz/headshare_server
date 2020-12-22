import { Field, ObjectType } from 'type-graphql';
import IRole from '../IRole';
import Role from '../RoleType';
import FieldError from '../../shared/ErrorResponse';

@ObjectType()
export default class RoleResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Role, { nullable: true })
  role?: IRole;
}
