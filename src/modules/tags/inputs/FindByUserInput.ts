import { Field, InputType } from 'type-graphql';

@InputType()
export default class FindByUserInput {
  @Field(() => String, { description: 'Community slug' })
  communitySlug: string;

  @Field(() => String, { description: 'User slug' })
  userInput: string;
}
