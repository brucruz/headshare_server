import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType({ description: 'Media file model' })
export default class File {
  @Field(() => String, { description: 'Media file name', nullable: true })
  name?: string;

  @Field(() => Int, { description: 'Media file size', nullable: true })
  size?: number;

  @Field(() => String, { description: 'Media file extension', nullable: true })
  extension?: string;

  @Field(() => String, { description: 'Media file mime type', nullable: true })
  type?: string;
}
