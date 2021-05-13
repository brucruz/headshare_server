import { Field, InputType } from 'type-graphql';
import ProductBenefitInput from './ProductBenefitInput';

@InputType()
export default class UpdateProductInput {
  @Field(() => String, {
    description: 'A community product name',
    nullable: true,
  })
  name?: string;

  @Field(() => String, {
    description: 'A community product description',
    nullable: true,
  })
  description?: string;

  @Field(() => String, {
    description: 'Mini-description shown on membership credit card invoice',
    nullable: true,
  })
  statementDescriptor?: string;

  @Field(() => [ProductBenefitInput], {
    description:
      'Owner selected tags to appear on community home, given a specific order',
    nullable: true,
  })
  benefits?: ProductBenefitInput[];

  @Field(() => String, {
    description: 'Stripe connected account ID',
    nullable: true,
  })
  stripeProductId?: string;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}
