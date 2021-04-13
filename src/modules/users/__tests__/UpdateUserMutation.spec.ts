import { createTestClient } from 'apollo-server-testing';
import { createUser } from '../../../test/createRows';
import { cleanDB, connectToDB, disconnectDB } from '../../../test/testDb';
import getTestServer from '../../../test/testRun';
// import { IUser } from '../IUser';

const gql = String.raw;

// let user: IUser;

const email = 'johndoe@example.com';

beforeAll(connectToDB);

beforeEach(cleanDB);

afterAll(disconnectDB);

describe('an attempt to update an user info', () => {
  const mutation = gql`
    mutation M($_id: ObjectId!, $updateData: EditMeInput!) {
      updateUser(_id: $_id, updateData: $updateData) {
        user {
          name
          surname
        }
        errors {
          field
          message
        }
      }
    }
  `;

  it('should update an user', async () => {
    const user = await createUser({ email });

    const variables = {
      _id: user._id.toString(),
      updateData: {
        name: 'Jane',
        surname: 'Doe',
      },
    };

    const testServer = await getTestServer(user._id);

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    expect(result.errors).toBeFalsy();
    expect(JSON.stringify(result.data?.updateUser.user.name)).toEqual(
      JSON.stringify('Jane'),
    );
    expect(JSON.stringify(result.data?.updateUser.user.surname)).toEqual(
      JSON.stringify('Doe'),
    );
  });

  it('should not update an non-existent user', async () => {
    const variables = {
      _id: '123456789012345678901234', // non-existent-id
      updateData: {
        name: 'Jane',
        surname: 'Doe',
      },
    };

    const testServer = await getTestServer();

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.updateUser.errors).toBeTruthy();
    expect(result.data?.updateUser.user).toBeFalsy();
  });
});
