import { Field, InputType } from 'type-graphql';
import { RoleOptions } from '../IRole';
import Role from '../RoleType';

@InputType()
export default class CreateRoleInput implements Partial<Role> {
  @Field(() => RoleOptions, { description: 'User role in community' })
  role: RoleOptions;

  @Field(() => String, {
    description: 'User of which the role is about',
  })
  userId: string;

  @Field(() => String, {
    description: 'Community of which the role is about',
  })
  communityId: string;
}
