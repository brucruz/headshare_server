import { Field, ObjectType } from 'type-graphql';
import IMedia from '../IMedia';
import Media from '../MediaType';
import FieldError from '../../shared/ErrorResponse';

@ObjectType()
export default class MediasResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => [Media], { nullable: true })
  medias?: IMedia[];
}
