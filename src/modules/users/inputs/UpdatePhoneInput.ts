import { Field, InputType } from 'type-graphql';

@InputType()
export default class UpdatePhoneInput {
  @Field(() => String, {
    description: 'Phone number country code',
    nullable: true,
  })
  countryCode?: string;

  @Field(() => String, {
    description: 'Phone number regional code (DDD), if existent',
    nullable: true,
  })
  areaCode?: string;

  @Field(() => String, { description: 'Phone number', nullable: true })
  phone?: string;
}
