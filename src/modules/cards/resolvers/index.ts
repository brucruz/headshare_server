import { AuthenticationError, UserInputError } from 'apollo-server-errors';
import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { ApolloContext } from '../../../apollo-server/ApolloContext';
import { IUser } from '../../users/IUser';
import UserModel from '../../users/UserModel';
import CardModel from '../CardModel';
import Card from '../CardType';
import { ICard } from '../ICard';
import CreateCardInput from '../inputs/CreateCardInput';
import PaginatedCards from './PaginatedCards';

@Resolver(_of => Card)
export default class CardResolver {
  @Mutation(() => Card, { description: 'Creates a new card for a given user' })
  async createCard(
    @Arg('data', () => CreateCardInput)
    {
      brand,
      expirationDate,
      fingerprint,
      firstDigits,
      lastDigits,
      holderName,
      pagarmeId,
      valid,
    }: CreateCardInput,
    @Ctx() { req }: ApolloContext,
  ): Promise<ICard> {
    const creator = req.session.userId;

    if (!creator) {
      throw new AuthenticationError(
        'You must be connected to a community to create a card',
      );
    }

    if (!valid) {
      throw new UserInputError('You must provide a valid card', {
        field: 'valid',
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cards = await CardModel.find({ user: creator as any });

    const isMain = !(cards.length > 0);

    const card = new CardModel({
      brand,
      expirationDate,
      fingerprint,
      firstDigits,
      lastDigits,
      holderName,
      pagarmeId,
      valid,
      isMain,
      user: creator,
    });

    await card.save();

    return card;
  }

  @Query(() => PaginatedCards, {
    description: 'Lists all cards, given filters',
  })
  async cards(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
    @Arg('userId', { nullable: true }) userId?: string,
  ): Promise<PaginatedCards> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    let cursorFilter = {};

    if (cursor) {
      const card = await CardModel.findById(cursor);

      if (!card) {
        throw new UserInputError('You must provide a valid cursor', {
          field: 'cursor',
        });
      }

      const { isMain, createdAt } = card;

      cursorFilter = {
        ...(cursor
          ? {
              isMain: {
                $gt: isMain,
              },
              createdAt: {
                $lt: createdAt,
              },
            }
          : {}),
      };
    }

    const optionsFilter = {
      ...(userId
        ? {
            user: userId as any,
          }
        : {}),
    };

    const cards = await CardModel.find({ ...cursorFilter, ...optionsFilter })
      .sort({ isMain: 'desc', createdAt: 'desc' })
      .limit(realLimitPlusOne);

    const edges = cards.slice(0, realLimit);
    const hasMore = cards.length === realLimitPlusOne;
    const next = hasMore
      ? cards.slice(realLimit, realLimitPlusOne)[0]._id
      : undefined;

    return {
      cards: edges,
      hasMore,
      next,
    };
  }

  @FieldResolver()
  async user(@Root() card: Card): Promise<IUser> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await UserModel.findById(card._doc.user))!;
  }
}
