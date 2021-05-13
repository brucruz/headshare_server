import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
  ApolloError,
} from 'apollo-server-errors';
import Stripe from 'stripe';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { ApolloContext } from '../../../apollo-server/ApolloContext';
import CommunityModel from '../../communities/CommunityModel';
import ProductModel from '../../products/ProductModel';
import RoleModel from '../../roles/RoleModel';
import { stripe } from '../../shared/providers/PaymentProvider/implementations/StripeProvider';
import IPrice, { PriceType } from '../IPrice';
import PriceModel from '../PriceModel';
import Price from '../PriceType';
import CreatePriceInput from './input/CreatePriceInput';

@Resolver(_of => Price)
export default class PriceResolver {
  @Mutation(() => Price)
  async createPrice(
    @Arg('communityId', () => String) communityId: string,
    @Arg('productId', () => String) productId: string,
    @Arg('priceData', () => CreatePriceInput)
    {
      amount,
      currency,
      type,
      nickname,
      recurringInterval,
      recurringIntervalCount,
      trialDays,
    }: CreatePriceInput,
    @Ctx() { req }: ApolloContext,
  ): Promise<IPrice> {
    const { userId } = req.session;

    if (!userId) {
      throw new AuthenticationError(
        'You must be connected to create a product',
      );
    }

    const community = await CommunityModel.findById(communityId);

    if (!community) {
      throw new UserInputError('You must provide a valid community Id', {
        field: 'communityId',
      });
    }

    const product = await ProductModel.findById(productId);

    if (!product) {
      throw new UserInputError('You must provide a valid product Id', {
        field: 'productId',
      });
    }

    if (product.community.toString() !== communityId) {
      throw new ForbiddenError('You cannot modify another community product');
    }

    const isCreator = await RoleModel.isCreator(userId, communityId);

    if (!isCreator) {
      throw new ForbiddenError(
        'You must be this community creator to create a product',
      );
    }

    let price: IPrice;

    try {
      const recurring: Stripe.PriceCreateParams.Recurring | undefined =
        type === PriceType.RECURRING && recurringInterval
          ? {
              interval: recurringInterval,
              interval_count: recurringIntervalCount,
              trial_period_days: trialDays,
            }
          : undefined;

      const stripePrice = await stripe.prices.create({
        currency,
        nickname,
        unit_amount: amount,
        product: product.stripeProductId,
        recurring,
      });

      price = new PriceModel({
        amount: stripePrice.unit_amount,
        currency: stripePrice.currency.toLowerCase(),
        type,
        nickname,
        recurringInterval,
        recurringIntervalCount,
        trialDays,
        stripePriceId: stripePrice.id,
      });

      await price.save();
    } catch (err) {
      throw new ApolloError(`${err.message}`, err.statusCode);
    }

    return price;
  }
}
