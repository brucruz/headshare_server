import { Field, ObjectType } from 'type-graphql';
import ICommunity from '../ICommunity';
import Community from '../CommunityType';
import FieldError from '../../shared/ErrorResponse';

@ObjectType()
export default class CommunityResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Community, { nullable: true })
  community?: ICommunity;
}
