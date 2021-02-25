import { Field, InputType } from 'type-graphql';
import { MediaFormat } from '../../IMedia';
import FileInput from './FileInput';

@InputType()
export default class UpdateMediaInput {
  @Field(() => MediaFormat, { description: 'Media format', nullable: true })
  format?: MediaFormat;

  @Field(() => String, { description: 'Media url', nullable: true })
  url?: string;

  @Field(() => String, {
    description: 'Media thumbnail picture url',
    nullable: true,
  })
  thumbnailUrl?: string;

  @Field(() => String, { description: 'Media internal name', nullable: true })
  name?: string;

  @Field(() => String, {
    description: 'Media internal description',
    nullable: true,
  })
  description?: string;

  @Field(() => FileInput, {
    description: 'Media file information',
    nullable: true,
  })
  file?: FileInput;

  @Field(() => Number, {
    description: 'Media original width (for images)',
    nullable: true,
  })
  width?: number;

  @Field(() => Number, {
    description: 'Media original height (for images)',
    nullable: true,
  })
  height?: number;
}
