import { Field, InputType } from 'type-graphql';
import Tag from '../TagType';

@InputType()
export default class UpdateTagInput implements Partial<Tag> {
  @Field(() => String, { description: 'Tag title', nullable: true })
  title?: string;

  @Field(() => String, {
    description: 'Tag slug to use on url',
    nullable: true,
  })
  slug?: string;

  @Field(() => String, { description: 'Tag description', nullable: true })
  description?: string;
}
