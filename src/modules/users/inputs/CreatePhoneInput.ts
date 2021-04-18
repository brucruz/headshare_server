import { Field, InputType } from 'type-graphql';

@InputType()
export default class CreatePhoneInput {
  @Field(() => String, { description: 'Phone number country code' })
  countryCode: string;

  @Field(() => String, {
    description: 'Phone number regional code (DDD), if existent',
    nullable: true,
  })
  areaCode?: string;

  @Field(() => String, { description: 'Phone number' })
  phone: string;
}
