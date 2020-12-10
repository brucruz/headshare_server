import { createUser } from '../../../test/createRows';
import { cleanDB, connectToDB, disconnectDB } from '../../../test/testDb';
import runQuery from '../../../test/testRun';

const gql = String.raw;

beforeAll(connectToDB);

beforeEach(cleanDB);

afterAll(disconnectDB);

describe('UserRegisterMutation', () => {
  it('should register an user', async () => {
    const name = 'John';
    const email = 'johndoe@example.com';
    const password = '123456';

    const mutation = gql`
      mutation M($input: RegisterUserInput!) {
        register(data: $input) {
          data {
            token
            user {
              name
              email
            }
          }
          errors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        name,
        email,
        password,
      },
    };

    const result = await runQuery(mutation, variables);

    expect(result.errors).toBeUndefined();
    expect(JSON.stringify(result.data?.register.data.user.name)).toEqual(
      JSON.stringify(name),
    );
    expect(JSON.stringify(result.data?.register.data.user.email)).toEqual(
      JSON.stringify(email),
    );
    expect(result.data?.register.data.token).toBeTruthy();
  });

  it('should not register an user with an existent email', async () => {
    const name = 'John';
    const email = 'johndoe@example.com';
    const password = '123456';

    const mutation = gql`
      mutation M($input: RegisterUserInput!) {
        register(data: $input) {
          data {
            token
            user {
              name
              email
            }
          }
          errors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        name,
        email,
        password,
      },
    };

    await createUser({ email });

    const result = await runQuery(mutation, variables);

    expect(result.errors).toBeUndefined();
    expect(result.data?.register.data).toBeFalsy();
    expect(result.data?.register.errors).toBeTruthy();
  });
});
