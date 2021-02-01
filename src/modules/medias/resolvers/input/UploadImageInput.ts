import { Field, InputType } from 'type-graphql';
import { MediaFormat } from '../../IMedia';
import FileInput from './FileInput';

@InputType()
export default class UploadImageInput {
  @Field(() => MediaFormat, { description: 'Media format' })
  format: MediaFormat;

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

  @Field(() => FileInput, { description: 'Media file information' })
  file: FileInput;
}
