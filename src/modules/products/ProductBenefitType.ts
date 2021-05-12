import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType({ description: 'Community product benefit model' })
export default class ProductBenefit {
  @Field(() => String, {
    description: 'The community product description',
  })
  description: string;

  @Field(() => Int, {
    description: 'The order of the community product description',
  })
  order: number;
}
