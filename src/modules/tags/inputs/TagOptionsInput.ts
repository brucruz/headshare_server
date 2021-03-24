import { Field, InputType } from 'type-graphql';

@InputType()
export default class TagOptionsInput {
  @Field(() => String, {
    description: 'Specifies the community id',
    nullable: true,
  })
  communityId?: any;
}
