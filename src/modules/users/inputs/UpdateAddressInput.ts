import { Field, InputType } from 'type-graphql';

@InputType()
export default class UpdateAddressInput {
  @Field(() => String, { description: 'Street name', nullable: true })
  street?: string;

  @Field(() => String, { description: 'Street number', nullable: true })
  number?: string;

  @Field(() => String, {
    description: 'Address complementary info',
    nullable: true,
  })
  complement?: string;

  @Field(() => String, { description: 'Address neighbourhood', nullable: true })
  neighbourhood?: string;

  @Field(() => String, { description: 'Address city name', nullable: true })
  city?: string;

  @Field(() => String, { description: 'Address zipcode', nullable: true })
  zipcode?: string;

  @Field(() => String, { description: 'Address state name', nullable: true })
  state?: string;

  @Field(() => String, { description: 'Address country name', nullable: true })
  country?: string;
}
