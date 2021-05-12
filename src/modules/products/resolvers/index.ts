import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
  ApolloError,
} from 'apollo-server-errors';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { ApolloContext } from '../../../apollo-server/ApolloContext';
import CommunityModel from '../../communities/CommunityModel';
import RoleModel from '../../roles/RoleModel';
import { stripe } from '../../shared/providers/PaymentProvider/implementations/StripeProvider';
import IProduct from '../IProduct';
import ProductModel from '../ProductModel';
import Product from '../ProductType';
import CreateProductInput from './input/CreateProductInput';

@Resolver(_of => Product)
export default class ProductResolver {
  @Mutation(() => Product)
  async createProduct(
    @Arg('productData', () => CreateProductInput)
    { communityId, name, description, statementDescriptor }: CreateProductInput,
    @Ctx() { req }: ApolloContext,
  ): Promise<IProduct> {
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

    const isCreator = await RoleModel.isCreator(userId, communityId);

    if (!isCreator) {
      throw new ForbiddenError(
        'You must be this community creator to create a product',
      );
    }

    if (statementDescriptor && statementDescriptor.length > 15) {
      throw new UserInputError(
        'Statement descriptor must have up to 15 characters',
        {
          field: 'statementDescriptor',
        },
      );
    }

    let product: IProduct;

    try {
      product = new ProductModel({
        name,
        description,
        statementDescriptor,
        community: community._id,
        isActive: false,
      });

      const stripeProduct = await stripe.products.create({
        name,
        description,
        statement_descriptor: statementDescriptor,
        active: false,
        metadata: {
          community: community.title,
          communityId,
        },
      });

      product.stripeProductId = stripeProduct.id;

      await product.save();
    } catch (err) {
      throw new ApolloError(`error: ${err}`);
    }

    return product;
  }
}
