import { ObjectId } from 'mongodb';
import { Field, ObjectType } from 'type-graphql';
import { ObjectIdScalar } from '../../type-graphql/ObjectIdScalar';

@ObjectType({ description: 'The Communities model' })
export default class Community {
  @Field(() => ObjectIdScalar)
  readonly _id: typeof ObjectId;

  @Field(() => String, { description: 'Community title', nullable: true })
  logo?: string;

  @Field(() => String, { description: 'Community title' })
  title: string;

  @Field(() => String, { description: 'Community slug to use on url' })
  slug: string;

  @Field(() => String, { description: 'Community description', nullable: true })
  description?: string;

  _doc?: any;

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  removedAt: Date;

  @Field({ description: 'Community creation date' })
  createdAt: Date;

  @Field({ description: 'Community last update date', nullable: true })
  updatedAt: Date;
}
