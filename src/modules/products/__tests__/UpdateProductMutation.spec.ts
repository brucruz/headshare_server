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

const gql = String.raw;

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

describe('an user', () => {
  const mutation = gql`
    mutation M(
      $communityId: String!
      $productId: String!
      $productData: UpdateProductInput!
    ) {
      updateProduct(
        communityId: $communityId
        productId: $productId
        productData: $productData
      ) {
        name
        description
        benefits {
          description
          order
        }
        statementDescriptor
        isActive
      }
    }
  `;

  it('should be able to update a product', async () => {
    const name = 'Test';
    const description = 'Product updated automatically by a test';
    const statementDescriptor = 'Test Product';
    const user = await createUser();
    const community = await createCommunity({}, user._id);
    const product = await createProduct({}, community._id);

    const variables = {
      productId: product._id.toString(),
      communityId: community._id.toString(),
      productData: {
        name,
        description,
        statementDescriptor,
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

  it('should not be able to update product if not logged', async () => {
    const name = 'Test';
    const description = 'Product updated automatically by a test';
    const statementDescriptor = 'Test Product';
    const user = await createUser();
    const community = await createCommunity({}, user._id);
    const product = await createProduct({}, community._id);

    const variables = {
      communityId: community._id.toString(),
      productId: product._id.toString(),
      productData: {
        name,
        description,
        statementDescriptor,
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

  it('should not be able to update product if not a community creator', async () => {
    const name = 'Test';
    const description = 'Product updated automatically by a test';
    const statementDescriptor = 'Test Product';
    const user = await createUser();
    const creator = await createUser();
    const community = await createCommunity({}, creator._id);
    const product = await createProduct({}, community._id);

    const variables = {
      communityId: community._id.toString(),
      productId: product._id.toString(),
      productData: {
        name,
        description,
        statementDescriptor,
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

  it('should not be able to update product if it is not owned by its informed community', async () => {
    const name = 'Test';
    const description = 'Product updated automatically by a test';
    const statementDescriptor = 'Test Product';
    const creator = await createUser();
    const user = await createUser();
    const userCommunity = await createCommunity({}, user._id);
    const creatorCommunity = await createCommunity({}, creator._id);
    const product = await createProduct({}, creatorCommunity._id);

    const variables = {
      communityId: userCommunity._id.toString(),
      productId: product._id.toString(),
      productData: {
        name,
        description,
        statementDescriptor,
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

  it('should not be able to update a product if providing a non-existent communityId', async () => {
    const name = 'Test';
    const description = 'Product updated automatically by a test';
    const statementDescriptor = 'Test Product';
    const user = await createUser();
    const communityId = new ObjectId().toString(); // 'Non-existent-community-id'
    const product = await createProduct({}, communityId);

    const variables = {
      communityId,
      productId: product._id.toString(),
      productData: {
        name,
        description,
        statementDescriptor,
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

  it('should not be able to update a product if statement descriptor has more than 15 characters', async () => {
    const name = 'Test';
    const description = 'Product updated automatically by a test';
    const statementDescriptor = 'Enormous Product';
    const user = await createUser();
    const community = await createCommunity({}, user._id);
    const product = await createProduct({}, community._id);

    const variables = {
      communityId: community._id.toString(),
      productId: product._id.toString(),
      productData: {
        name,
        description,
        statementDescriptor,
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
