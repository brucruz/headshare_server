import { createTestClient } from 'apollo-server-testing';
import { createCard, createUser } from '../../../test/createRows';
import getTestServer, {
  connectMongoose,
  clearDbAndRestartCounters,
  disconnectMongoose,
} from '../../../test/testRun';
import CardModel from '../CardModel';

const gql = String.raw;

beforeAll(connectMongoose);
beforeEach(clearDbAndRestartCounters);
afterAll(disconnectMongoose);

const mutation = gql`
  mutation CreateCard($data: CreateCardInput!) {
    createCard(data: $data) {
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
`;

describe('a visitor attempting to store a user card', () => {
  it('is not able to store a card if not authenticated', async () => {
    const pagarmeId = '001';
    const brand = 'Mastercard';
    const holderName = 'Teste';
    const firstDigits = '123456';
    const lastDigits = '7890';
    const fingerprint = '1234567890';
    const valid = true;
    const expirationDate = '0122';

    const variables = {
      data: {
        pagarmeId,
        brand,
        holderName,
        firstDigits,
        lastDigits,
        fingerprint,
        valid,
        expirationDate,
      },
    };

    const testServer = await getTestServer();

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    const authenticationError = result.errors?.filter(
      error => error.extensions?.code === 'UNAUTHENTICATED',
    );

    expect(result.errors).toBeTruthy();
    expect(authenticationError?.length).toBeGreaterThan(0);
    expect(result.data).toBeFalsy();
  });

  it('is able to store a card', async () => {
    const user = await createUser();

    const pagarmeId = '001';
    const brand = 'Mastercard';
    const holderName = 'Teste';
    const firstDigits = '123456';
    const lastDigits = '7890';
    const fingerprint = '1234567890';
    const valid = true;
    const expirationDate = '0122';

    const variables = {
      data: {
        pagarmeId,
        brand,
        holderName,
        firstDigits,
        lastDigits,
        fingerprint,
        valid,
        expirationDate,
      },
    };

    const testServer = await getTestServer(user._id);

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    expect(result.errors).toBeFalsy();
    expect(result.data).toBeTruthy();
    expect(result.data).toMatchSnapshot();
  });

  it('is not able to store an invalid card', async () => {
    const user = await createUser();

    const pagarmeId = '001';
    const brand = 'Mastercard';
    const holderName = 'Teste';
    const firstDigits = '123456';
    const lastDigits = '7890';
    const fingerprint = '1234567890';
    const valid = false;
    const expirationDate = '0122';

    const variables = {
      data: {
        pagarmeId,
        brand,
        holderName,
        firstDigits,
        lastDigits,
        fingerprint,
        valid,
        expirationDate,
      },
    };

    const testServer = await getTestServer(user._id);

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    expect(result.errors).toBeTruthy();
    expect(result.data).toBeFalsy();
  });
});

describe('a user card list', () => {
  it('if empty, is able to set its first card as main', async () => {
    const user = await createUser();

    const pagarmeId = '001';
    const brand = 'Mastercard';
    const holderName = 'Teste';
    const firstDigits = '123456';
    const lastDigits = '7890';
    const fingerprint = '1234567890';
    const valid = true;
    const expirationDate = '0122';

    const variables = {
      data: {
        pagarmeId,
        brand,
        holderName,
        firstDigits,
        lastDigits,
        fingerprint,
        valid,
        expirationDate,
      },
    };

    const testServer = await getTestServer(user._id);

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    expect(result.errors).toBeFalsy();
    expect(result.data).toBeTruthy();
    expect(result.data.createCard.isMain).toBeTruthy();
  });

  it('if not empty, is able to set its following cards as not main', async () => {
    const user = await createUser();

    await createCard({}, user);

    const pagarmeId = '001';
    const brand = 'Mastercard';
    const holderName = 'Teste';
    const firstDigits = '123456';
    const lastDigits = '7890';
    const fingerprint = '1234567890';
    const valid = true;
    const expirationDate = '0122';

    const variables = {
      data: {
        pagarmeId,
        brand,
        holderName,
        firstDigits,
        lastDigits,
        fingerprint,
        valid,
        expirationDate,
      },
    };

    const testServer = await getTestServer(user._id);

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    expect(result.errors).toBeFalsy();
    expect(result.data).toBeTruthy();
    expect(result.data.createCard.isMain).toBeFalsy();
  });

  it('is able to have only one of its cards as main', async () => {
    const user = await createUser();

    await createCard({}, user);
    await createCard({}, user);
    await createCard({}, user);
    await createCard({}, user);

    const pagarmeId = '001';
    const brand = 'Mastercard';
    const holderName = 'Teste';
    const firstDigits = '123456';
    const lastDigits = '7890';
    const fingerprint = '1234567890';
    const valid = true;
    const expirationDate = '0122';

    const variables = {
      data: {
        pagarmeId,
        brand,
        holderName,
        firstDigits,
        lastDigits,
        fingerprint,
        valid,
        expirationDate,
      },
    };

    const testServer = await getTestServer(user._id);

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    const cards = await CardModel.find({ user: user._id });
    const mainCard = cards.filter(card => card.isMain);

    expect(result.errors).toBeFalsy();
    expect(result.data).toBeTruthy();
    expect(mainCard.length).toEqual(1);
  });
});
