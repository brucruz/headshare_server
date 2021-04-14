import { createTestClient } from 'apollo-server-testing';
import { createUser } from '../../../test/createRows';
import getTestServer, {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
} from '../../../test/testRun';
import { DocumentIdType } from '../IUser';

const gql = String.raw;

const email = 'johndoe@example.com';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

describe('an attempt to update an user info', () => {
  const mutation = gql`
    mutation M($_id: ObjectId!, $updateData: EditMeInput!) {
      updateUser(_id: $_id, updateData: $updateData) {
        user {
          name
          surname
          avatar
          address {
            street
            number
            complement
            neighbourhood
            city
            zipcode
            state
            country
          }
          documents {
            type
            number
          }
          phone {
            countryCode
            regionalCode
            phone
          }
          birthday
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
        password: '654321',
        avatar: 'avatar-url',
        address: {
          street: 'Test St.',
          number: '10',
          complement: 'Apartment 11',
          neighbourhood: 'Test Area',
          city: 'Testopolis',
          zipcode: '00000000',
          state: 'Test DC',
          country: 'Testland',
        },
        documents: [
          {
            type: DocumentIdType.CNPJ,
            number: '01234567898',
          },
        ],
        phone: {
          countryCode: '55',
          regionalCode: '11',
          phone: '912345678',
        },
        birthday: new Date(1980, 1, 1).toISOString(),
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
