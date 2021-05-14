import { Field, InputType, Int } from 'type-graphql';
import { PriceType, RecurringInterval } from '../../IPrice';

@InputType()
export default class CreatePriceInput {
  @Field(() => String, { description: 'A product price currency' })
  currency: string;

  @Field(() => String, {
    description: 'A product price nickname',
    nullable: true,
  })
  nickname?: string;

  @Field(() => PriceType, {
    description:
      'Especifies if the customer has to pay once or repeately to mantain access to the product',
  })
  type: PriceType;

  @Field(() => RecurringInterval, {
    description: 'The possible diferent periods a recurring price might take',
    nullable: true,
  })
  recurringInterval?: RecurringInterval;

  @Field(() => Int, {
    description: 'The number of recurring intervals to aply to each invoice',
    nullable: true,
  })
  recurringIntervalCount?: number;

  @Field(() => Int, {
    description: 'The amount billed per invoice to the customer',
  })
  amount: number;

  @Field(() => Int, {
    description: 'The number of days before charging the customer',
    nullable: true,
  })
  trialDays?: number;
}
