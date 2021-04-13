import { Field, InputType } from 'type-graphql';

@InputType()
export default class CreateAddressInput {
  @Field(() => String, { description: 'Street name' })
  street: string;

  @Field(() => String, { description: 'Street number' })
  number: string;

  @Field(() => String, {
    description: 'Address complementary info',
    nullable: true,
  })
  complement?: string;

  @Field(() => String, { description: 'Address neighbourhood', nullable: true })
  neighbourhood?: string;

  @Field(() => String, { description: 'Address city name' })
  city: string;

  @Field(() => String, { description: 'Address zipcode' })
  zipcode: string;

  @Field(() => String, { description: 'Address state name', nullable: true })
  state?: string;

  @Field(() => String, { description: 'Address country name' })
  country: string;
}
