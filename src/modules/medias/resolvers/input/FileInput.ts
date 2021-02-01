import { Field, InputType, Int } from 'type-graphql';

@InputType()
export default class FileInput {
  @Field(() => String, { description: 'Media file name', nullable: true })
  name?: string;

  @Field(() => Int, { description: 'Media file size', nullable: true })
  size?: number;

  @Field(() => String, { description: 'Media file type', nullable: true })
  type?: string;

  @Field(() => String, { description: 'Media file extension', nullable: true })
  extension?: string;
}
