import { Field, InputType, Int } from 'type-graphql';

@InputType()
export default class HighlightedTagInput {
  @Field(() => String, {
    description: 'The community highlighted tag',
  })
  tag: string;

  @Field(() => Int, {
    description: 'The order of the community highlighted tag',
  })
  order: number;
}
