import { InputType, Field } from "type-graphql";
import { IUser } from "../IUser";

@InputType()
export default class LoginUserInput implements Partial<IUser> {
  @Field(() => String, { description: 'User email to be used on login' })
  email: string;

  @Field(() => String, { description: 'User password to be used on login', nullable: true })
  password: string;
}
