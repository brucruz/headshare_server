import { Field, InputType } from 'type-graphql';
import HighlightedTagInput from './HighlightedTagInput';

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

  @Field(() => String, { description: 'Community tagline', nullable: true })
  tagline?: string;

  @Field(() => String, { description: 'Community description', nullable: true })
  description?: string;

  @Field(() => String, {
    description: 'Community avatar used to visually identify community info',
    nullable: true,
  })
  avatar?: string;

  @Field(() => String, {
    description: 'Community image banner to be displayed in its homepage',
    nullable: true,
  })
  banner?: string;

  @Field(() => [HighlightedTagInput], {
    description:
      'Owner selected tags to appear on community home, given a specific order',
    nullable: true,
  })
  highlightedTags?: HighlightedTagInput[];
}
