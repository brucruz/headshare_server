import { ObjectId } from 'mongodb';
import { Field, ObjectType } from 'type-graphql';
import DateTimeScalar from '../../type-graphql/DateTimeScalar';
import ObjectIdScalar from '../../type-graphql/ObjectIdScalar';
import Community from '../communities/CommunityType';
import ProductBenefit from './ProductBenefitType';

@ObjectType({ description: 'The Products model' })
export default class Product {
  @Field(() => ObjectIdScalar)
  readonly _id: typeof ObjectId;

  @Field(() => String, { description: 'A community product name' })
  name: string;

  @Field(() => String, {
    description: 'A community product description',
    nullable: true,
  })
  description?: string;

  @Field(() => [ProductBenefit], {
    description:
      'Owner selected tags to appear on community home, given a specific order',
  })
  benefits: ProductBenefit[];

  @Field(() => String, {
    description: 'Mini-description shown on membership credit card invoice',
    nullable: true,
  })
  statementDescriptor?: string;

  @Field(() => String, {
    description: 'Stripe connected account ID',
  })
  stripeProductId: string;

  @Field(() => Community, {
    description: 'Community which is the owner of this product',
  })
  community: Community;

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
