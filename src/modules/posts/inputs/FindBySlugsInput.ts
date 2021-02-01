import { Field, InputType } from 'type-graphql';

@InputType()
export default class FindBySlugsInput {
  @Field(() => String, { description: 'Community slug' })
  communitySlug: string;

  @Field(() => String, { description: 'Post slug' })
  postSlug: string;
}
