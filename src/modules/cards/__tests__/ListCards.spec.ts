import { createTestClient } from 'apollo-server-testing';
import { createCard, createUser } from '../../../test/createRows';
import getTestServer, {
  connectMongoose,
  clearDbAndRestartCounters,
  disconnectMongoose,
} from '../../../test/testRun';

const gql = String.raw;

beforeAll(connectMongoose);
beforeEach(clearDbAndRestartCounters);
afterAll(disconnectMongoose);

const queryGQL = gql`
  query Cards($cursor: String, $limit: Int!, $userId: String) {
    cards(cursor: $cursor, limit: $limit, userId: $userId) {
      cards {
        pagarmeId
        brand
        holderName
        firstDigits
        lastDigits
        fingerprint
        valid
        expirationDate
        isMain
        user {
          name
          email
        }
      }
      hasMore
      next
    }
  }
`;

const queryGQLwoNext = gql`
  query Cards($cursor: String, $limit: Int!, $userId: String) {
    cards(cursor: $cursor, limit: $limit, userId: $userId) {
      cards {
        pagarmeId
        brand
        holderName
        firstDigits
        lastDigits
        fingerprint
        valid
        expirationDate
        isMain
        user {
          name
          email
        }
      }
    }
  }
`;

describe('an admin user', () => {
  it('is able to list all stored cards, regardless of who created them', async () => {
    const user1 = await createUser();
    const user2 = await createUser();

    await createCard({}, user1);
    await createCard({}, user1);

    await createCard({}, user2);
    await createCard({}, user2);

    const variables = {
      cursor: undefined,
      limit: 5,
      userId: undefined,
    };

    const testServer = await getTestServer();

    const { query } = createTestClient(testServer());
    const result = await query({
      query: queryGQL,
      variables,
    });

    expect(result.errors).toBeFalsy();
    expect(result.data).toBeTruthy();
    expect(result.data.cards).toMatchSnapshot();
  });

  it('is able to see the first page of stored cards', async () => {
    const user1 = await createUser();
    const user2 = await createUser();

    await createCard({}, user1);
    await createCard({}, user1);

    await createCard({}, user2);
    await createCard({}, user2);

    const variables = {
      cursor: undefined,
      limit: 3,
      userId: undefined,
    };

    const testServer = await getTestServer();

    const { query } = createTestClient(testServer());
    const result = await query({
      query: queryGQLwoNext,
      variables,
    });

    expect(result.errors).toBeFalsy();
    expect(result.data).toBeTruthy();
    expect(result.data.cards).toMatchSnapshot();
  });

  it('is able to see the second page of stored cards', async () => {
    const user1 = await createUser();
    const user2 = await createUser();

    await createCard({}, user1);
    await createCard({}, user1);

    await createCard({}, user2);
    await createCard({}, user2);

    const variables1 = {
      cursor: undefined,
      limit: 3,
      userId: undefined,
    };

    const testServer = await getTestServer();

    const { query } = createTestClient(testServer());
    const result1 = await query({
      query: queryGQL,
      variables: variables1,
    });

    const variables2 = {
      cursor: result1.data.cards.next,
      limit: 3,
      userId: undefined,
    };
    const result2 = await query({
      query: queryGQLwoNext,
      variables: variables2,
    });

    expect(result2.errors).toBeFalsy();
    expect(result2.data).toBeTruthy();
    expect(result2.data.cards).toMatchSnapshot();
  });
});

describe('a logged user', () => {
  it('is able to list all his stored cards', async () => {
    const user1 = await createUser();
    const user2 = await createUser();

    await createCard({}, user1);
    await createCard({}, user1);

    await createCard({}, user2);
    await createCard({}, user2);

    const variables = {
      cursor: undefined,
      limit: 5,
      userId: user1._id.toString(),
    };

    const testServer = await getTestServer();

    const { query } = createTestClient(testServer());
    const result = await query({
      query: queryGQL,
      variables,
    });

    expect(result.errors).toBeFalsy();
    expect(result.data).toBeTruthy();
    expect(result.data.cards).toMatchSnapshot();
  });
});
