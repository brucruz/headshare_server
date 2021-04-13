import { createTestClient } from 'apollo-server-testing';
import { createUser } from '../../../test/createRows';
import getTestServer, {
  clearDatabase,
  connectMongoose,
  disconnectMongoose,
} from '../../../test/testRun';

const gql = String.raw;

beforeAll(connectMongoose);

beforeEach(clearDatabase);

afterAll(disconnectMongoose);

describe('a user attempting to login', () => {
  const mutation = gql`
    mutation M($input: LoginUserInput!) {
      login(loginData: $input) {
        user {
          _id
          name
          email
        }
        errors {
          field
          message
        }
      }
    }
  `;

  it('should login an user', async () => {
    const password = '123456';

    const user = await createUser({ password });

    const variables = {
      input: {
        email: user.email,
        password,
      },
    };

    const testServer = await getTestServer(user._id);

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    expect(result.errors).toBeUndefined();
    expect(JSON.stringify(result.data?.login.user._id)).toEqual(
      JSON.stringify(user._id),
    );
  });

  it('should not login an user with the incorrect password', async () => {
    const password = '123456';

    const user = await createUser({ password });

    const variables = {
      input: {
        email: user.email,
        password: 'wrong-password',
      },
    };

    const testServer = await getTestServer(user._id);

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.login.errors).toBeTruthy();
  });

  it('should not login an user who does not have an created password', async () => {
    const user = await createUser({ password: undefined });

    const variables = {
      input: {
        email: user.email,
        password: '123456',
      },
    };

    const testServer = await getTestServer(user._id);

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.login.errors).toBeTruthy();
  });

  it('should not login an non-existent user', async () => {
    const variables = {
      input: {
        email: 'johndoe@example.com',
        password: 'password',
      },
    };

    const testServer = await getTestServer();

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.login.errors).toBeTruthy();
  });
});
