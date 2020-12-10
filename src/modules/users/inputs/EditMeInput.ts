import { InputType, Field } from 'type-graphql';
import { IUser } from '../IUser';

@InputType()
export default class EditMeInput implements Partial<IUser> {
  @Field(() => String, { description: 'User name', nullable: true })
  name?: string;

  @Field(() => String, { description: 'User surname', nullable: true })
  surname?: string;

  @Field(() => String, {
    description: 'User email to be used on login',
    nullable: true,
  })
  email?: string;

  @Field(() => String, {
    description: 'User password to be used on login',
    nullable: true,
  })
  password?: string;

  @Field({ description: 'User avatar image link', nullable: true })
  avatar?: string;
}
