/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId } from 'mongodb';
import { Field, ObjectType } from 'type-graphql';
import DateTimeScalar from '../../type-graphql/DateTimeScalar';
import ObjectIdScalar from '../../type-graphql/ObjectIdScalar';
import User from '../users/UserType';

@ObjectType({ description: 'The Cards model' })
export default class Card {
  @Field(() => ObjectIdScalar)
  readonly _id: ObjectId;

  @Field(() => String, { description: 'Card ID at Pagarme' })
  pagarmeId: string;

  @Field(() => String, { description: 'Card brand' })
  brand: string;

  @Field(() => String, { description: 'Card holder name' })
  holderName: string;

  @Field(() => String, { description: 'Card first 6 digits' })
  firstDigits: string;

  @Field(() => String, { description: 'Card last 4 digits' })
  lastDigits: string;

  @Field(() => String, { description: 'Card fingerprint' })
  fingerprint: string;

  @Field(() => Boolean, { description: 'Card is valid if it is not expired' })
  valid: boolean;

  @Field(() => String, { description: 'Card expiration date' })
  expirationDate: string;

  @Field(() => Boolean, {
    description: 'Indicates if this card is its user main one',
    defaultValue: false,
  })
  isMain: boolean;

  @Field(() => User)
  user: User;

  _doc?: any;

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => DateTimeScalar, { nullable: true })
  removedAt?: Date;

  @Field(() => DateTimeScalar, { description: 'Card creation date' })
  createdAt: Date;

  @Field(() => DateTimeScalar, {
    description: 'Card last update date',
    nullable: true,
  })
  updatedAt: Date;
}
