import { Field, InputType } from 'type-graphql';

@InputType()
export default class CreateCommunityInput {
  @Field(() => String, { description: 'Community title', nullable: true })
  logo?: string;

  @Field(() => String, { description: 'Community title' })
  title: string;

  @Field(() => String, { description: 'Community slug to use on url' })
  slug: string;

  @Field(() => String, { description: 'Community description', nullable: true })
  description?: string;
}
