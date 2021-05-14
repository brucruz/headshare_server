import { Field, ObjectType } from 'type-graphql';
import { ICard } from '../ICard';
import Card from '../CardType';

@ObjectType()
export default class PaginatedCards {
  @Field(() => [Card])
  cards: ICard[];

  @Field()
  hasMore: boolean;

  @Field(() => String, { nullable: true })
  next?: string;
}
