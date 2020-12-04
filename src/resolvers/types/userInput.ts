import { User } from "src/models/User";
import { InputType, Field } from "type-graphql";

@InputType()
export class RegisterInput implements Partial<User> {
  @Field(() => String, { description: 'User name' })
  name: string;

  @Field(() => String, { description: 'User surname', nullable: true })
  surname: string;

  @Field(() => String, { description: 'User email to be used on login' })
  email: string;

  @Field(() => String, { description: 'User password to be used on login', nullable: true })
  password: string;
}

@InputType()
export class UpdateUserInput implements Partial<User> {
  @Field(() => String, { description: 'User name', nullable: true })
  name?: string;

  @Field(() => String, { description: 'User surname', nullable: true })
  surname?: string;

  @Field(() => String, { description: 'User email to be used on login', nullable: true })
  email?: string;

  @Field(() => String, { description: 'User password to be used on login', nullable: true })
  password?: string;
}

@InputType()
export class LoginInput implements Partial<User> {
  @Field(() => String, { description: 'User email to be used on login' })
  email: string;

  @Field(() => String, { description: 'User password to be used on login', nullable: true })
  password: string;
}
