import { Field, ObjectType } from 'type-graphql';
import ITag from '../ITag';
import Tag from '../TagType';
import FieldError from '../../shared/ErrorResponse';

@ObjectType()
export default class TagResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Tag, { nullable: true })
  tag?: ITag;
}
