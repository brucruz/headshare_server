import { Field, InputType } from 'type-graphql';

@InputType()
export default class CreateProductInput {
  @Field(() => String, { description: 'A community product name' })
  name: string;

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

  @Field(() => String, {
    description: 'CommunityId to which this product will be attached to',
  })
  communityId: string;
}
