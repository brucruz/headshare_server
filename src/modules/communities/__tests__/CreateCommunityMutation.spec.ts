import { createTestClient } from 'apollo-server-testing';
import { createUser } from '../../../test/createRows';
import getTestServer, {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
} from '../../../test/testRun';

const gql = String.raw;

function mockCreateStripeAccount() {
  return {
    id: 'stripe-account-id',
  };
}

jest.mock(
  '../../shared/providers/PaymentProvider/implementations/StripeProvider',
  () => ({
    stripe: {
      accounts: {
        create: mockCreateStripeAccount,
      },
    },
  }),
);

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

describe('an user', () => {
  const mutation = gql`
    mutation M($communityData: CreateCommunityInput!) {
      createCommunity(communityData: $communityData) {
        community {
          title
          slug
          creator {
            name
          }
        }
        errors {
          field
          message
        }
      }
    }
  `;

  it('should be able to create a community', async () => {
    const name = 'John';
    const user = await createUser({ name });
    const title = 'Test community';
    const slug = 'test';

    const variables = {
      communityData: {
        title,
        slug,
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

  it('should not be able to create community if not logged', async () => {
    const title = 'Test community';
    const slug = 'test';

    const variables = {
      communityData: {
        title,
        slug,
      },
    };

    const testServer = await getTestServer();

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    expect(result.errors).toBeFalsy();
    expect(result.data).toMatchSnapshot();
  });
});
