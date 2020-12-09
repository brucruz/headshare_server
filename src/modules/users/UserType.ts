import { hash } from 'argon2';
import { ObjectId } from 'mongodb';
import { Field, ObjectType } from 'type-graphql';
import { ObjectIdScalar } from '../../type-graphql/ObjectIdScalar';
import Post from '../posts/PostType';

@ObjectType({ description: 'The Users model' })
export default class User {
  @Field(() => ObjectIdScalar)
  readonly _id: ObjectId;

  @Field(() => String, { description: 'User name' })
  name: string;

  @Field({ description: 'User surname', nullable: true })
  surname?: string;

  @Field({ description: 'User email to be used on login' })
  email: string;

  password?: string;

  @Field(() => [Post])
  posts: Post[];

  _doc?: any;

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  removedAt?: Date;

  @Field({ description: 'User creation date' })
  createdAt: Date;

  @Field({ description: 'User last update date', nullable: true })
  updatedAt: Date;

  static async encryptPassword(password: string): Promise<string> {
    return hash(password);
  }
}
