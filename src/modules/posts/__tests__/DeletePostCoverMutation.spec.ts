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
import { MediaFormat } from '../../medias/IMedia';
import FileInput from '../../medias/resolvers/input/FileInput';

const gql = String.raw;

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

describe('a post cover', () => {
  const mutation = gql`
    mutation DeletePostCover($communitySlug: String!, $postId: String!) {
      deletePostCover(communitySlug: $communitySlug, postId: $postId) {
        cover {
          file {
            name
            type
            size
          }
        }
      }
    }
  `;

  it('should be able to be removed', async () => {
    const user = await createUser();
    const community = await createCommunity({}, user._id);
    const format = 'IMAGE' as MediaFormat.IMAGE;
    const file: FileInput = { name: 'tests/images/test.jpg', type: 'jpg' };
    const cover = (await createMedia({ format, file }, community._id))._id;
    const post = await createPost({ cover }, user._id, community._id);

    const variables = {
      communitySlug: community.slug,
      postId: post._id.toString(),
    };

    const testServer = await getTestServer(user._id);

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    expect(result.errors).toBeFalsy();
    expect(result.data.deletePostCover).toBeTruthy();
    expect(result.data).toMatchSnapshot();
  });
});
