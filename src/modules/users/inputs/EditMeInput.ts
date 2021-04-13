import { InputType, Field } from 'type-graphql';
import CreateAddressInput from './CreateAddressInput';
import CreatePersonalDocumentInput from './CreatePersonalDocumentInput';
import CreatePhoneInput from './CreatePhoneInput';

@InputType()
export default class EditMeInput {
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

  @Field(() => String, {
    description: 'User avatar image link',
    nullable: true,
  })
  avatar?: string;

  @Field(() => CreateAddressInput, {
    description: 'User address',
    nullable: true,
  })
  address?: CreateAddressInput;

  @Field(() => [CreatePersonalDocumentInput], {
    description: 'User personal documents',
    nullable: true,
  })
  documents?: CreatePersonalDocumentInput[];

  @Field(() => CreatePhoneInput, {
    description: 'User phone info',
    nullable: true,
  })
  phone?: CreatePhoneInput;

  @Field(() => Date, { description: 'User birthday', nullable: true })
  birthday?: Date;
}
