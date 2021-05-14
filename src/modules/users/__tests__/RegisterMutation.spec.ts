import { createTestClient } from 'apollo-server-testing';
import { createUser } from '../../../test/createRows';
import getTestServer, {
  connectMongoose,
  disconnectMongoose,
  clearDbAndRestartCounters,
} from '../../../test/testRun';

const gql = String.raw;

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

describe('a visitor attempting to register as user', () => {
  const mutation = gql`
    mutation M($input: RegisterUserInput!) {
      register(data: $input) {
        user {
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

  it('should register an user', async () => {
    const name = 'John';
    const email = 'johndoe@example.com';
    const password = '123456';

    const variables = {
      input: {
        name,
        email,
        password,
      },
    };

    const testServer = await getTestServer();

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    expect(result.errors).toBeUndefined();
    expect(JSON.stringify(result.data?.register.user.name)).toEqual(
      JSON.stringify(name),
    );
    expect(JSON.stringify(result.data?.register.user.email)).toEqual(
      JSON.stringify(email),
    );
  });

  it('should not register an user with an existent email', async () => {
    const name = 'John';
    const email = 'johndoe@example.com';
    const password = '123456';

    const variables = {
      input: {
        name,
        email,
        password,
      },
    };

    await createUser({ email });

    const testServer = await getTestServer();

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.register.user).toBeFalsy();
    expect(result.data?.register.errors).toBeTruthy();
  });
});
