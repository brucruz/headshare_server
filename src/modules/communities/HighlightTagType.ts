import { Field, Int, ObjectType } from 'type-graphql';
import Tag from '../tags/TagType';

@ObjectType({ description: 'Community highlighted tag model' })
export default class HighlightedTag {
  @Field(() => Tag, {
    description: 'The community highlighted tag',
  })
  tag: Tag;

  @Field(() => Int, {
    description: 'The order of the community highlighted tag',
  })
  order: number;
}
