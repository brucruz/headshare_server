import { Field, InputType } from 'type-graphql';

@InputType()
export default class FindByTagsInput {
  @Field(() => String, { description: 'Community slug' })
  communitySlug: string;

  @Field(() => String, { description: 'Tag slug' })
  tagSlug: string;
}
