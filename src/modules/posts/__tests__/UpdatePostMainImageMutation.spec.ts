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
    mutation UpdatePostCover(
      $communitySlug: String!
      $postId: String!
      $imageData: UploadImageInput!
    ) {
      updatePostMainImage(
        communitySlug: $communitySlug
        postId: $postId
        imageData: $imageData
      ) {
        post {
          mainMedia {
            url
          }
        }
      }
    }
  `;

  it('main image should be able to be uploaded then updated', async () => {
    const user = await createUser();
    const community = await createCommunity({}, user._id);
    const post = await createPost({}, user._id, community._id);
    const format = 'IMAGE';
    const file: FileInput = { name: 'tests/images/test.jpg', type: 'jpg' };

    const variables = {
      postId: post._id.toString(),
      communitySlug: community.slug,
      imageData: {
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
    expect(result.data.updatePostMainImage.errors).toBeFalsy();
    expect(result.data.updatePostMainImage.post).toBeTruthy();
    expect(result.data).toMatchSnapshot();
  });
});
