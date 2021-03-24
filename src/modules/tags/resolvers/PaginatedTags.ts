import { Field, ObjectType } from 'type-graphql';
import ITag from '../ITag';
import Tag from '../TagType';

@ObjectType()
export default class PaginatedTags {
  @Field(() => [Tag])
  tags: ITag[];

  @Field()
  hasMore: boolean;
}
