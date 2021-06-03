/* eslint-disable import/prefer-default-export */
/* eslint-disable no-multi-assign */
import { hash } from 'argon2';
import CardModel from '../modules/cards/CardModel';
import { ICard } from '../modules/cards/ICard';
import CreateCardInput from '../modules/cards/inputs/CreateCardInput';
import CommunityModel from '../modules/communities/CommunityModel';
import ICommunity from '../modules/communities/ICommunity';
import CreateCommunityInput from '../modules/communities/resolvers/input/CreateCommunityInput';
import IMedia from '../modules/medias/IMedia';
import MediaModel from '../modules/medias/MediaModel';
import UploadMediaInput from '../modules/medias/resolvers/input/UploadMediaInput';
import CreatePostInput from '../modules/posts/inputs/CreatePostInput';
import IPost from '../modules/posts/IPost';
import PostModel from '../modules/posts/PostModel';
import IPrice, { PriceType } from '../modules/prices/IPrice';
import PriceModel from '../modules/prices/PriceModel';
import CreatePriceInput from '../modules/prices/resolvers/input/CreatePriceInput';
import IProduct from '../modules/products/IProduct';
import ProductModel from '../modules/products/ProductModel';
import CreateProductInput from '../modules/products/resolvers/input/CreateProductInput';
import { RoleOptions } from '../modules/roles/IRole';
import RoleModel from '../modules/roles/RoleModel';
import { stripe } from '../modules/shared/providers/PaymentProvider/implementations/StripeProvider';
import CreateTagInput from '../modules/tags/inputs/CreateTagInput';
import ITag from '../modules/tags/ITag';
import TagModel from '../modules/tags/TagModel';
import RegisterUserInput from '../modules/users/inputs/RegisterUserInput';
import { IUser } from '../modules/users/IUser';
import UserModel from '../modules/users/UserModel';

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? DeepPartial<U>[]
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>;
};

export const startCounters = (): void => {
  global.__COUNTERS__ = {
    user: 0,
    community: 0,
    tag: 0,
    post: 0,
    media: 0,
    product: 0,
    card: 0,
  };
};

export const restartCounters = (): void => {
  global.__COUNTERS__ = Object.keys(global.__COUNTERS__).reduce(
    (prev, curr) => ({ ...prev, [curr]: 0 }),
    {} as NodeJS.Counters,
  );
};

export const createUser = async (
  args: DeepPartial<RegisterUserInput> = {},
): Promise<IUser> => {
  const { name, email, password, ...rest } = args;

  const n = (global.__COUNTERS__.user += 1);

  const user = await new UserModel({
    name: name || `Normal user ${n}`,
    email: email || `user-${n}@example.com`,
    password: await hash(password || '123456789'),
    ...rest,
  }).save();

  return user;
};

export const createCommunity = async (
  args: DeepPartial<CreateCommunityInput> = {},
  creator: string,
): Promise<ICommunity> => {
  const { title, slug, ...rest } = args;

  const n = (global.__COUNTERS__.community += 1);

  const community = await new CommunityModel({
    title: title || `Community #${n}`,
    slug: slug || `community-${n}`,
    ...rest,
  }).save();

  await new RoleModel({
    community: community._id,
    role: RoleOptions.CREATOR,
    user: creator.toString(),
  }).save();

  return community;
};

export const createTag = async (
  args: DeepPartial<CreateTagInput> = {},
  communityId?: string,
): Promise<ITag> => {
  const { title, slug, ...rest } = args;

  const n = (global.__COUNTERS__.tag += 1);

  const tag = await new TagModel({
    title: title || `Tag #${n}`,
    slug: slug || `tag-${n}`,
    community: communityId,
    ...rest,
  }).save();

  return tag;
};

export const createPost = async (
  args: DeepPartial<CreatePostInput> & {
    cover?: string;
    mainMedia?: string;
  } = {},
  creator: string,
  communityId?: string,
): Promise<IPost> => {
  const { title, slug, cover, mainMedia, ...rest } = args;

  const n = (global.__COUNTERS__.post += 1);

  const post = await new PostModel({
    title: title || `Post #${n}`,
    slug: slug || `post-${n}`,
    community: communityId,
    mainMedia,
    cover,
    creator,
    ...rest,
  }).save();

  return post;
};

export const createMedia = async (
  args: DeepPartial<UploadMediaInput> = {},
  communityId: string,
): Promise<IMedia> => {
  const { name, ...rest } = args;

  const n = (global.__COUNTERS__.media += 1);

  const media = await new MediaModel({
    name: name || `Media #${n}`,
    community: communityId,
    url: `https://test.media/${n}`,
    uploadLink: `https://upload-test.media/${n}`,
    ...rest,
  }).save();

  return media;
};

export const createProduct = async (
  args: DeepPartial<CreateProductInput> = {},
  communityId?: string,
): Promise<IProduct> => {
  const { name: receivedName, ...rest } = args;

  const n = (global.__COUNTERS__.product += 1);

  const name = receivedName || `Product #${n}`;

  const product = await new ProductModel({
    name,
    stripeProductId: (await stripe.products.create({ name })).id,
    community: communityId,
    ...rest,
  }).save();

  return product;
};

export const createPrice = async (
  args: DeepPartial<CreatePriceInput> = {},
  communityId?: string,
  productId?: string,
): Promise<IPrice> => {
  const { currency: receivedCurrency, type, amount, ...rest } = args;

  const productObject = await ProductModel.findById(productId);
  const product = productObject && productObject.stripeProductId;

  const currency = receivedCurrency || 'USD';
  // eslint-disable-next-line camelcase
  const unit_amount = amount || 10;

  const stripePriceId =
    product &&
    (await stripe.prices.create({ currency, unit_amount, product })).id;

  const price = await new PriceModel({
    currency: currency || 'USD',
    type: type || PriceType.ONETIME,
    amount: amount || 10,
    stripePriceId,
    product: productId,
    community: communityId,
    ...rest,
  }).save();

  return price;
};

export const createCard = async (
  args: DeepPartial<CreateCardInput> = {},
  user: IUser,
): Promise<ICard> => {
  const { holderName, expirationDate, ...rest } = args;

  const n = (global.__COUNTERS__.card += 1);

  const cards = await CardModel.find({ user: user._id });

  const card = await new CardModel({
    pagarmeId: `000${n}`,
    brand: `Test`,
    holderName: holderName || `Normal User ${n}`,
    firstDigits: `1234${n}`,
    lastDigits: `78${n}`,
    fingerprint: `iohnmgiigndq${n}ouiyb78t`,
    valid: true,
    expirationDate: expirationDate || '1299',
    isMain: !(cards.length > 0),
    user: user._id,
    ...rest,
  }).save();

  return card;
};
