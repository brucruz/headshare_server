/* eslint-disable @typescript-eslint/no-explicit-any */
import { hash } from 'argon2';
import { ObjectId } from 'mongodb';
import { Field, ObjectType } from 'type-graphql';
import DateTimeScalar from '../../type-graphql/DateTimeScalar';
import ObjectIdScalar from '../../type-graphql/ObjectIdScalar';
import Post from '../posts/PostType';
import Role from '../roles/RoleType';
import Address from './AddressType';
import PersonalDocument from './PersonalDocumentType';
import Phone from './PhoneType';

@ObjectType({ description: 'The Users model' })
export default class User {
  @Field(() => ObjectIdScalar)
  readonly _id: ObjectId;

  @Field(() => String, { description: 'User name' })
  name: string;

  @Field(() => String, { description: 'User surname', nullable: true })
  surname?: string;

  @Field(() => String, { description: 'User email to be used on login' })
  email: string;

  password?: string;

  @Field(() => String, {
    description: 'User avatar image link',
    nullable: true,
  })
  avatar?: string;

  @Field(() => String, {
    description: 'Stripe customer Id',
    nullable: true,
  })
  stripeCustomerId?: string;

  @Field(() => Address, { description: 'User address', nullable: true })
  address?: Address;

  @Field(() => [PersonalDocument], { description: 'User personal documents' })
  documents: PersonalDocument[];

  @Field(() => Phone, { description: 'User phone info', nullable: true })
  phone?: Phone;

  @Field(() => Date, { description: 'User birthday', nullable: true })
  birthday?: Date;

  @Field(() => [Post])
  posts: Post[];

  @Field(() => [Role])
  roles: Role[];

  _doc?: any;

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => DateTimeScalar, { nullable: true })
  removedAt?: Date;

  @Field(() => DateTimeScalar, { description: 'User creation date' })
  createdAt: Date;

  @Field(() => DateTimeScalar, {
    description: 'User last update date',
    nullable: true,
  })
  updatedAt: Date;

  static async encryptPassword(password: string): Promise<string> {
    return hash(password);
  }
}
