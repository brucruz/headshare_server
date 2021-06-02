import { createTestClient } from 'apollo-server-testing';
import {
  createCommunity,
  createPost,
  createUser,
} from '../../../test/createRows';
import getTestServer, {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
} from '../../../test/testRun';
import FileInput from '../../medias/resolvers/input/FileInput';

const gql = String.raw;

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

describe('a post', () => {
  const mutation = gql`
    mutation UpdatePostMainVideo(
      $communitySlug: String!
      $postId: String!
      $videoData: UploadVideoInput!
    ) {
      updatePostMainVideo(
        communitySlug: $communitySlug
        postId: $postId
        videoData: $videoData
      ) {
        mainMedia {
          file {
            name
            type
            size
          }
        }
      }
    }
  `;

  it('main video should be able to be uploaded then updated', async () => {
    const user = await createUser();
    const community = await createCommunity({}, user._id);
    const post = await createPost({}, user._id, community._id);
    const format = 'VIDEO';
    const file: FileInput = {
      name: 'tests/videos/test.mov',
      type: 'mov',
      size: 1024,
    };

    const variables = {
      postId: post._id.toString(),
      communitySlug: community.slug,
      videoData: {
        format,
        file,
      },
    };

    const testServer = await getTestServer(user._id);

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    expect(result.errors).toBeFalsy();
    expect(result.data.updatePostMainVideo).toBeTruthy();
    expect(result.data).toMatchSnapshot();
  });
});
