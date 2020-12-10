import {
  Resolver,
  Query,
  UseMiddleware,
  Mutation,
  Arg,
  Ctx,
} from 'type-graphql';
import { ApolloContext } from '../../../apollo-server/ApolloContext';
import isAuth from '../../../middlewares/isAuth';
import CommunityModel from '../CommunityModel';
import Community from '../CommunityType';
import ICommunity from '../ICommunity';
import CreateCommunityInput from './input/CreateCommunityInput';

@Resolver(_of => Community)
export default class CommunityResolver {
  @Query(() => [Community])
  async communities(): Promise<ICommunity[]> {
    return CommunityModel.find({});
  }

  @Mutation(() => Community, {
    description: 'Users can create a community',
  })
  @UseMiddleware(isAuth)
  async createCommunity(
    @Arg('communityData')
    { logo, title, slug, description }: CreateCommunityInput,
    @Ctx() { req }: ApolloContext,
  ): Promise<ICommunity> {
    const creator = req.user?.id;

    const community = new CommunityModel({
      logo,
      title,
      slug,
      description,
      creator,
    });

    await community.save();

    return community;
  }
}
