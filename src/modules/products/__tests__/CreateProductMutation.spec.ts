import { createTestClient } from 'apollo-server-testing';
import { ObjectId } from 'mongodb';
import { createCommunity, createUser } from '../../../test/createRows';
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
    mutation M($productData: CreateProductInput!) {
      createProduct(productData: $productData) {
        name
        description
        benefits {
          description
          order
        }
        statementDescriptor
        stripeProductId
        isActive
      }
    }
  `;

  it('should be able to create a product', async () => {
    const name = 'Test';
    const description = 'Product created automated by a test';
    const statementDescriptor = 'Test Product';
    const user = await createUser();
    const community = await createCommunity({}, user._id);

    const variables = {
      productData: {
        name,
        description,
        statementDescriptor,
        communityId: community._id.toString(),
      },
    };

    const testServer = await getTestServer(user._id);

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    const { stripeProductId, ...product } = result.data.createProduct;

    expect(result.errors).toBeFalsy();
    expect(product).toMatchSnapshot();
    expect(typeof stripeProductId).toBe(typeof 'string');
  });

  it('should not be able to create product if not logged', async () => {
    const name = 'Test';
    const description = 'Product created automated by a test';
    const statementDescriptor = 'Test Product';
    const user = await createUser();
    const community = await createCommunity({}, user._id);

    const variables = {
      productData: {
        name,
        description,
        statementDescriptor,
        communityId: community._id.toString(),
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

  it('should be its community creator to create product for it', async () => {
    const name = 'Test';
    const description = 'Product created automated by a test';
    const statementDescriptor = 'Test Product';
    const user = await createUser();
    const creator = await createUser();
    const community = await createCommunity({}, creator._id);

    const variables = {
      productData: {
        name,
        description,
        statementDescriptor,
        communityId: community._id.toString(),
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

  it('should not be able to create a product if providing a non-existent communityId', async () => {
    const name = 'Test';
    const description = 'Product created automated by a test';
    const statementDescriptor = 'Test Product';
    const user = await createUser();

    const variables = {
      productData: {
        name,
        description,
        statementDescriptor,
        communityId: new ObjectId().toString(), // 'Non-existent-community-id'
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

  it('should not be able to create a product if statement descriptor has more than 15 characters', async () => {
    const name = 'Test';
    const description = 'Product created automated by a test';
    const statementDescriptor = 'Enormous Product';
    const user = await createUser();
    const community = await createCommunity({}, user._id);

    const variables = {
      productData: {
        name,
        description,
        statementDescriptor,
        communityId: community._id.toString(),
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
