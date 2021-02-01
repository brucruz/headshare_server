import { ObjectId } from 'mongodb';
import { Field, ObjectType } from 'type-graphql';
import ObjectIdScalar from '../../type-graphql/ObjectIdScalar';
import Community from '../communities/CommunityType';
import { MediaFormat } from './IMedia';
import File from './FileType';
import DateTimeScalar from '../../type-graphql/DateTimeScalar';

@ObjectType({ description: 'Media model' })
export default class Media {
  @Field(() => ObjectIdScalar)
  readonly _id: typeof ObjectId;

  @Field(() => MediaFormat, { description: 'Media format' })
  format: MediaFormat;

  @Field(() => String, { description: 'Media host url' })
  url: string;

  @Field(() => String, {
    description: 'Media thumbnail host url',
    nullable: true,
  })
  thumbnailUrl: string;

  @Field(() => String, { description: 'Media internal name', nullable: true })
  name: string;

  @Field(() => String, {
    description: 'Media internal description',
    nullable: true,
  })
  description: string;

  @Field(() => File, { description: 'Media file information' })
  file: File;

  @Field(() => String, {
    description: 'Link through which the media file should be uploaded to',
  })
  uploadLink: string;

  @Field(_type => Community)
  community: ObjectId;

  _doc?: any;

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => DateTimeScalar, { nullable: true })
  removedAt: Date;

  @Field(() => DateTimeScalar, { description: 'Post creation date' })
  createdAt: Date;

  @Field(() => DateTimeScalar, {
    description: 'Post last update date',
    nullable: true,
  })
  updatedAt: Date;
}
