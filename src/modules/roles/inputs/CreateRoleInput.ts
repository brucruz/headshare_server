import { Field, InputType } from 'type-graphql';
import ObjectIdScalar from '../../../type-graphql/ObjectIdScalar';
import Community from '../../communities/CommunityType';
import User from '../../users/UserType';
import { RoleOptions } from '../IRole';
import Role from '../RoleType';

@InputType()
export default class CreateRoleInput implements Partial<Role> {
  @Field(() => RoleOptions, { description: 'User role in community' })
  role: RoleOptions;

  @Field(() => ObjectIdScalar, {
    description: 'User of which the role is about',
  })
  user: User;

  @Field(() => ObjectIdScalar, {
    description: 'Community of which the role is about',
  })
  community: Community;
}
