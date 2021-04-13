import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'Phone Info Model' })
export default class Phone {
  @Field(() => String, { description: 'Phone number country code' })
  countryCode: string;

  @Field(() => String, {
    description: 'Phone number regional code (DDD), if existent',
    nullable: true,
  })
  regionalCode?: string;

  @Field(() => String, { description: 'Phone number' })
  phone: string;
}
