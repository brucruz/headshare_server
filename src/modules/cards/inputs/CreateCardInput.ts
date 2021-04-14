import { Field, InputType } from 'type-graphql';

@InputType()
export default class CreateCardInput {
  @Field(() => String, { description: 'Card ID at Pagarme' })
  pagarmeId: string;

  @Field(() => String, { description: 'Card brand' })
  brand: string;

  @Field(() => String, { description: 'Card holder name' })
  holderName: string;

  @Field(() => String, { description: 'Card first 6 digits' })
  firstDigits: string;

  @Field(() => String, { description: 'Card last 4 digits' })
  lastDigits: string;

  @Field(() => String, { description: 'Card fingerprint' })
  fingerprint: string;

  @Field(() => Boolean, { description: 'Card is valid if it is not expired' })
  valid: boolean;

  @Field(() => String, { description: 'Card expiration date' })
  expirationDate: string;
}
