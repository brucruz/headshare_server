import { Field, InputType, Int } from 'type-graphql';

@InputType()
export default class ProductBenefitInput {
  @Field(() => String, { description: 'A community product name' })
  description: string;

  @Field(() => Int, {
    description: 'A community product description',
    nullable: true,
  })
  order: number;
}
