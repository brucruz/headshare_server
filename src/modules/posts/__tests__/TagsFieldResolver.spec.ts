import { createTestClient } from 'apollo-server-testing';
import {
  createCommunity,
  createPost,
  createTag,
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

describe('post tags field', () => {
  const query = gql`
    query GetPostById($id: String!) {
      findPostById(id: $id) {
        errors {
          field
          message
        }
        post {
          tags(limit: 10) {
            tags {
              title
            }
            hasMore
          }
        }
      }
    }
  `;

  it('should be able to list a post tags queried by a user', async () => {
    const user = await createUser();
    const community = await createCommunity({}, user._id);
    const tags = [(await createTag({}, community._id))._id];
    const post = await createPost({ tags }, user._id, community._id);

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

  it('should be able to return empty array to a post tags queried by a user', async () => {
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
