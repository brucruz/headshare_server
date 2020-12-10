import { createUser } from '../../../test/createRows';
import { cleanDB, connectToDB, disconnectDB } from '../../../test/testDb';
import runQuery from '../../../test/testRun';

const gql = String.raw;

beforeAll(connectToDB);

beforeEach(cleanDB);

afterAll(disconnectDB);

describe('UserLoginMutation', () => {
  it('should login an user', async () => {
    const password = '123456';

    const user = await createUser({ password });

    const mutation = gql`
      mutation M($input: LoginUserInput!) {
        login(loginData: $input) {
          data {
            token
            user {
              _id
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
        email: user.email,
        password,
      },
    };

    const result = await runQuery(mutation, variables);

    expect(result.errors).toBeUndefined();
    expect(JSON.stringify(result.data?.login.data.user._id)).toEqual(
      JSON.stringify(user._id),
    );
    expect(result.data?.login.data.token).toBeTruthy();
  });

  it('should not login an user with the incorrect password', async () => {
    const password = '123456';

    const user = await createUser({ password });

    const mutation = gql`
      mutation M($input: LoginUserInput!) {
        login(loginData: $input) {
          data {
            token
            user {
              _id
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
        email: user.email,
        password: 'wrong-password',
      },
    };

    const result = await runQuery(mutation, variables);

    expect(result.errors).toBeUndefined();
    expect(result.data?.login.errors).toBeTruthy();
    expect(result.data?.login.data).toBeFalsy();
  });

  it('should not login an user who does not have an created password', async () => {
    const user = await createUser({ password: undefined });

    const mutation = gql`
      mutation M($input: LoginUserInput!) {
        login(loginData: $input) {
          data {
            token
            user {
              _id
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
        email: user.email,
        password: '123456',
      },
    };

    const result = await runQuery(mutation, variables);

    expect(result.errors).toBeUndefined();
    expect(result.data?.login.errors).toBeTruthy();
    expect(result.data?.login.data).toBeFalsy();
  });

  it('should not login an non-existent user', async () => {
    await createUser();

    const mutation = gql`
      mutation M($input: LoginUserInput!) {
        login(loginData: $input) {
          data {
            token
            user {
              _id
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
        email: 'johndoe@example.com',
        password: 'password',
      },
    };

    const result = await runQuery(mutation, variables);

    expect(result.errors).toBeUndefined();
    expect(result.data?.login.errors).toBeTruthy();
    expect(result.data?.login.data).toBeFalsy();
  });
});
