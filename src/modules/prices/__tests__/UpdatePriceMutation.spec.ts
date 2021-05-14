import { createTestClient } from 'apollo-server-testing';
import { ObjectId } from 'mongodb';
import {
  createCommunity,
  createPrice,
  createProduct,
  createUser,
} from '../../../test/createRows';
import getTestServer, {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
} from '../../../test/testRun';

const gql = String.raw;

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

describe('an user', () => {
  const mutation = gql`
    mutation M(
      $communityId: String!
      $priceId: String!
      $priceData: UpdatePriceInput!
    ) {
      updatePrice(
        communityId: $communityId
        priceId: $priceId
        priceData: $priceData
      ) {
        isActive
      }
    }
  `;

  it('should be able to update product price', async () => {
    const isActive = false;
    const user = await createUser();
    const community = await createCommunity({}, user._id);
    const product = await createProduct({}, community._id);
    const price = await createPrice({}, community._id, product._id);

    const variables = {
      communityId: community._id.toString(),
      priceId: price._id.toString(),
      priceData: {
        isActive,
      },
    };

    const testServer = await getTestServer(user._id);

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    expect(result.errors).toBeFalsy();
    expect(result.data).toMatchSnapshot();
  });

  it('should not be able to update product price if not logged', async () => {
    const isActive = false;
    const user = await createUser();
    const community = await createCommunity({}, user._id);
    const product = await createProduct({}, community._id);
    const price = await createPrice({}, community._id, product._id);

    const variables = {
      communityId: community._id.toString(),
      priceId: price._id.toString(),
      priceData: {
        isActive,
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

  it('should not be able to update product price if not a community creator', async () => {
    const isActive = false;
    const user = await createUser();
    const creator = await createUser();
    const community = await createCommunity({}, creator._id);
    const product = await createProduct({}, community._id);
    const price = await createPrice({}, community._id, product._id);

    const variables = {
      communityId: community._id.toString(),
      priceId: price._id.toString(),
      priceData: {
        isActive,
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

  it('should not be able to update product price if it is not owned by its informed community', async () => {
    const isActive = false;
    const creator = await createUser();
    const user = await createUser();
    const userCommunity = await createCommunity({}, user._id);
    const creatorCommunity = await createCommunity({}, creator._id);
    const product = await createProduct({}, creatorCommunity._id);
    const price = await createPrice({}, creatorCommunity._id, product._id);

    const variables = {
      communityId: userCommunity._id.toString(),
      priceId: price._id.toString(),
      priceData: {
        isActive,
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

  it('should not be able to update product price if providing a non-existent communityId', async () => {
    const isActive = false;
    const user = await createUser();
    const communityId = new ObjectId().toString(); // 'Non-existent-community-id'
    const product = await createProduct({}, communityId);
    const price = await createPrice({}, communityId, product._id);

    const variables = {
      communityId,
      priceId: price._id.toString(),
      priceData: {
        isActive,
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

  it('should not be able to update product price if providing a non-existent priceId', async () => {
    const isActive = false;
    const user = await createUser();
    const community = await createCommunity({}, user._id);
    const priceId = new ObjectId().toString(); // 'Non-existent-price-id'

    const variables = {
      communityId: community._id.toString(),
      priceId,
      priceData: {
        isActive,
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
