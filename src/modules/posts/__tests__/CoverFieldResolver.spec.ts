import { createTestClient } from 'apollo-server-testing';
import {
  createCommunity,
  createMedia,
  createPost,
  createUser,
} from '../../../test/createRows';
import getTestServer, {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
} from '../../../test/testRun';

const gql = String.raw;

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

describe('post cover field', () => {
  const query = gql`
    query GetPostById($id: String!) {
      findPostById(id: $id) {
        errors {
          field
          message
        }
        post {
          cover {
            name
          }
        }
      }
    }
  `;

  it('should be able to return a post cover queried by a user', async () => {
    const user = await createUser();
    const community = await createCommunity({}, user._id);
    const cover = (await createMedia({}, community._id))._id;
    const post = await createPost({ cover }, user._id, community._id);

    const variables = {
      id: post._id.toString(),
    };

    const testServer = await getTestServer(user._id);

    const { query: q } = createTestClient(testServer());
    const result = await q({
      query,
      variables,
    });

    expect(result.errors).toBeFalsy();
    expect(result.data.findPostById.errors).toBeFalsy();
    expect(result.data.findPostById.post).toBeTruthy();
    expect(result.data).toMatchSnapshot();
  });

  it('should be able to return null to a post cover queried by a user', async () => {
    const user = await createUser();
    const community = await createCommunity({}, user._id);
    const post = await createPost({}, user._id, community._id);

    const variables = {
      id: post._id.toString(),
    };

    const testServer = await getTestServer(user._id);

    const { query: q } = createTestClient(testServer());
    const result = await q({
      query,
      variables,
    });

    expect(result.errors).toBeFalsy();
    expect(result.data.findPostById.errors).toBeFalsy();
    expect(result.data.findPostById.post).toBeTruthy();
    expect(result.data).toMatchSnapshot();
  });
});
