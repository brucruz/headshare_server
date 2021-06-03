import { createTestClient } from 'apollo-server-testing';
import { ObjectId } from 'mongodb';
import { createCommunity, createUser } from '../../../test/createRows';
import getTestServer, {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
} from '../../../test/testRun';

const gql = String.raw;

function mockCreateStripeAccountLink() {
  return {
    url: 'http://example.com',
  };
}

jest.mock(
  '../../shared/providers/PaymentProvider/implementations/StripeProvider',
  () => ({
    stripe: {
      accountLinks: {
        create: mockCreateStripeAccountLink,
      },
    },
  }),
);

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

describe('an user', () => {
  const mutation = gql`
    mutation M($communityId: String!) {
      createStripeAccountLink(communityId: $communityId)
    }
  `;

  it('should be able to create a stripe account link', async () => {
    const user = await createUser();
    const title = 'Community';
    const community = await createCommunity({ title }, user._id);
    community.stripeAccountId = 'acct_1InxiyJvda45Xxc9';
    await community.save();

    const variables = {
      communityId: community._id.toString(),
    };

    const testServer = await getTestServer(user._id);

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    expect(result.errors).toBeFalsy();
    expect(typeof result.data.createStripeAccountLink).toBe(typeof 'string');
  });

  it('should not be able to create community stripe account link if not logged', async () => {
    const user = await createUser();
    const title = 'Community';
    const community = await createCommunity({ title }, user._id);

    const variables = {
      communityId: community._id.toString(),
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

  it('should not be able to create community stripe account link if not community creator', async () => {
    const realCreator = await createUser();
    const notCreator = await createUser();
    const title = 'Community';
    const community = await createCommunity({ title }, realCreator._id);

    const variables = {
      communityId: community._id.toString(),
    };

    const testServer = await getTestServer(notCreator._id);

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    expect(result.data).toBeFalsy();
    expect(result.errors).toBeTruthy();
    expect(result.errors).toMatchSnapshot();
  });

  it('should not be able to create community stripe account link if providing a non-existent communityId', async () => {
    const user = await createUser();

    const variables = {
      communityId: new ObjectId().toString(), // 'Non-existent-community-id'
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

  it('should not be able to create community stripe account link if providing the community does not have a stripe account yet', async () => {
    const user = await createUser();
    const title = 'Community';
    const community = await createCommunity({ title }, user._id);

    const variables = {
      communityId: community._id.toString(),
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
