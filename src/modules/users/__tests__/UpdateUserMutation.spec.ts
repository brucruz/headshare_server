import { createUser } from '../../../test/createRows';
import { cleanDB, connectToDB, disconnectDB } from '../../../test/testDb';
import runQuery from '../../../test/testRun';
// import { IUser } from '../IUser';

const gql = String.raw;

// let user: IUser;

const email = 'johndoe@example.com';

describe('UpdateUserMutation', () => {
  beforeAll(connectToDB);

  beforeEach(cleanDB);

  afterAll(disconnectDB);

  it('should update an user', async () => {
    const user = await createUser({ email });

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

    const variables = {
      _id: user._id.toString(),
      updateData: {
        name: 'Jane',
        surname: 'Doe',
      },
    };

    const result = await runQuery(mutation, variables);

    expect(result.errors).toBeFalsy();
    expect(JSON.stringify(result.data?.updateUser.user.name)).toEqual(
      JSON.stringify('Jane'),
    );
    expect(JSON.stringify(result.data?.updateUser.user.surname)).toEqual(
      JSON.stringify('Doe'),
    );
  });

  it('should not update an non-existent user', async () => {
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

    const variables = {
      _id: 'non-existent-id',
      updateData: {
        name: 'Jane',
        surname: 'Doe',
      },
    };

    const result = await runQuery(mutation, variables);

    expect(result.errors).toBeTruthy();
    expect(JSON.stringify(result.data?.updateUser.user.name)).toBeFalsy();
    expect(JSON.stringify(result.data?.updateUser.user.surname)).toBeFalsy();
  });
});
