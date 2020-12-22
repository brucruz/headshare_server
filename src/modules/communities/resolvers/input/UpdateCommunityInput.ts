import { Field, InputType } from 'type-graphql';

@InputType()
export default class UpdateCommunityInput {
  @Field(() => String, { description: 'Community title', nullable: true })
  logo?: string;

  @Field(() => String, { description: 'Community title', nullable: true })
  title?: string;

  @Field(() => String, {
    description: 'Community slug to use on url',
    nullable: true,
  })
  slug?: string;

  @Field(() => String, { description: 'Community description', nullable: true })
  description?: string;
}
