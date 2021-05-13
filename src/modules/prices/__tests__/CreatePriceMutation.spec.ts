import { createTestClient } from 'apollo-server-testing';
import { ObjectId } from 'mongodb';
import {
  createCommunity,
  createProduct,
  createUser,
} from '../../../test/createRows';
import getTestServer, {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
} from '../../../test/testRun';
import { PriceType } from '../IPrice';

const gql = String.raw;

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

describe('an user', () => {
  const mutation = gql`
    mutation M(
      $communityId: String!
      $productId: String!
      $priceData: CreatePriceInput!
    ) {
      createPrice(
        communityId: $communityId
        productId: $productId
        priceData: $priceData
      ) {
        currency
        nickname
        type
        recurringInterval
        recurringIntervalCount
        amount
        trialDays
        stripePriceId
      }
    }
  `;

  it('should be able to create product price price', async () => {
    const currency = 'BRL';
    const amount = 10;
    const type = PriceType.ONETIME;
    const nickname = 'Test price 01';
    const user = await createUser();
    const community = await createCommunity({}, user._id);
    const product = await createProduct({}, community._id);

    const variables = {
      communityId: community._id.toString(),
      productId: product._id.toString(),
      priceData: {
        currency,
        amount,
        type,
        nickname,
      },
    };

    const testServer = await getTestServer(user._id);

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    const { stripePriceId, ...price } = result.data.createPrice;

    expect(result.errors).toBeFalsy();
    expect(price).toMatchSnapshot();
    expect(typeof stripePriceId).toBe(typeof 'string');
  });

  it('should not be able to create product price if not logged', async () => {
    const currency = 'BRL';
    const amount = 10;
    const type = PriceType.ONETIME;
    const nickname = 'Test price 01';
    const user = await createUser();
    const community = await createCommunity({}, user._id);
    const product = await createProduct({}, community._id);

    const variables = {
      communityId: community._id.toString(),
      productId: product._id.toString(),
      priceData: {
        currency,
        amount,
        type,
        nickname,
      },
    };

    const testServer = await getTestServer();

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    expect(result.data).toBeFalsy();
    expect(result.errors).toBeTruthy();
    expect(result.errors).toMatchSnapshot();
  });

  it('should not be able to create product price if not a community creator', async () => {
    const currency = 'BRL';
    const amount = 10;
    const type = PriceType.ONETIME;
    const nickname = 'Test price 01';
    const user = await createUser();
    const creator = await createUser();
    const community = await createCommunity({}, creator._id);
    const product = await createProduct({}, community._id);

    const variables = {
      communityId: community._id.toString(),
      productId: product._id.toString(),
      priceData: {
        currency,
        amount,
        type,
        nickname,
      },
    };

    const testServer = await getTestServer(user._id);

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    expect(result.data).toBeFalsy();
    expect(result.errors).toBeTruthy();
    expect(result.errors).toMatchSnapshot();
  });

  it('should not be able to create product price if it is not owned by its informed community', async () => {
    const currency = 'BRL';
    const amount = 10;
    const type = PriceType.ONETIME;
    const nickname = 'Test price 01';
    const creator = await createUser();
    const user = await createUser();
    const userCommunity = await createCommunity({}, user._id);
    const creatorCommunity = await createCommunity({}, creator._id);
    const product = await createProduct({}, creatorCommunity._id);

    const variables = {
      communityId: userCommunity._id.toString(),
      productId: product._id.toString(),
      priceData: {
        currency,
        amount,
        type,
        nickname,
      },
    };

    const testServer = await getTestServer(user._id);

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    expect(result.data).toBeFalsy();
    expect(result.errors).toBeTruthy();
    expect(result.errors).toMatchSnapshot();
  });

  it('should not be able to create product price if providing a non-existent communityId', async () => {
    const currency = 'BRL';
    const amount = 10;
    const type = PriceType.ONETIME;
    const nickname = 'Test price 01';
    const user = await createUser();
    const communityId = new ObjectId().toString(); // 'Non-existent-community-id'
    const product = await createProduct({}, communityId);

    const variables = {
      communityId,
      productId: product._id.toString(),
      priceData: {
        currency,
        amount,
        type,
        nickname,
      },
    };

    const testServer = await getTestServer(user._id);

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    expect(result.data).toBeFalsy();
    expect(result.errors).toBeTruthy();
    expect(result.errors).toMatchSnapshot();
  });

  it('should not be able to create product price if providing a non-existent productId', async () => {
    const currency = 'BRL';
    const amount = 10;
    const type = PriceType.ONETIME;
    const nickname = 'Test price 01';
    const user = await createUser();
    const community = await createCommunity({}, user._id);
    const productId = new ObjectId().toString(); // 'Non-existent-community-id'

    const variables = {
      communityId: community._id.toString(),
      productId,
      priceData: {
        currency,
        amount,
        type,
        nickname,
      },
    };

    const testServer = await getTestServer(user._id);

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    expect(result.data).toBeFalsy();
    expect(result.errors).toBeTruthy();
    expect(result.errors).toMatchSnapshot();
  });
});
