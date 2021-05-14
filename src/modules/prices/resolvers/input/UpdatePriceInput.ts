import { Field, InputType } from 'type-graphql';

@InputType()
export default class UpdatePriceInput {
  @Field(() => String, {
    description: 'A product price nickname',
    nullable: true,
  })
  nickname?: string;

  @Field(() => Boolean, {
    description: 'Especifies if price is active',
    nullable: true,
  })
  isActive?: boolean;
}
