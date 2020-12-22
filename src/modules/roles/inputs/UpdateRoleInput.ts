import { Field, InputType } from 'type-graphql';
import { RoleOptions } from '../IRole';
import Role from '../RoleType';

@InputType()
export default class UpdateRoleInput implements Partial<Role> {
  @Field(() => RoleOptions, {
    description: 'User role in community',
    nullable: true,
  })
  role?: RoleOptions;
}
