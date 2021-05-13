import { ObjectId } from 'mongodb';
import { Field, Int, ObjectType } from 'type-graphql';
import DateTimeScalar from '../../type-graphql/DateTimeScalar';
import ObjectIdScalar from '../../type-graphql/ObjectIdScalar';
import Product from '../products/ProductType';
import { PriceType, RecurringInterval } from './IPrice';

@ObjectType({ description: 'The Products model' })
export default class Price {
  @Field(() => ObjectIdScalar)
  readonly _id: typeof ObjectId;

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

  @Field(() => String, {
    description: 'Stripe price ID',
  })
  stripePriceId: string;

  @Field(() => Product, {
    description: 'Product to which this price refers to',
  })
  product: Product;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _doc?: any;

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => DateTimeScalar, { nullable: true })
  removedAt: Date;

  @Field(() => DateTimeScalar, { description: 'Community creation date' })
  createdAt: Date;

  @Field(() => DateTimeScalar, {
    description: 'Community last update date',
    nullable: true,
  })
  updatedAt: Date;
}
