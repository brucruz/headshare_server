import { createTestClient } from 'apollo-server-testing';
import { ObjectId } from 'mongodb';
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

describe('a post', () => {
  const mutation = gql`
    mutation UpdatePost(
      $communitySlug: String!
      $postId: String!
      $post: UpdatePostInput!
    ) {
      updatePost(
        communitySlug: $communitySlug
        id: $postId
        updateData: $post
      ) {
        errors {
          field
          message
        }
        post {
          title
          formattedTitle
          slug
          description
          status
          mainMedia {
            url
            thumbnailUrl
            format
            width
            height
          }
          content
          exclusive
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

  it('tags should be able to be updated', async () => {
    const user = await createUser();
    const community = await createCommunity({}, user._id);
    const tags = [(await createTag({}, community._id))._id.toString()];
    const post = await createPost({}, user._id, community._id);

    const variables = {
      postId: post._id.toString(),
      communitySlug: community.slug,
      post: {
        tags,
      },
    };

    const testServer = await getTestServer(user._id);

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    expect(result.errors).toBeFalsy();
    expect(result.data.updatePost.errors).toBeFalsy();
    expect(result.data.updatePost.post).toBeTruthy();
    expect(result.data).toMatchSnapshot();
  });

  it('tags should not be able to be updated, if provided tags are non-existent', async () => {
    const user = await createUser();
    const community = await createCommunity({}, user._id);
    const tags = [new ObjectId().toString()]; // non-existent-tag
    const post = await createPost({}, user._id, community._id);

    const variables = {
      postId: post._id.toString(),
      communitySlug: community.slug,
      post: {
        tags,
      },
    };

    const testServer = await getTestServer(user._id);

    const { mutate } = createTestClient(testServer());
    const result = await mutate({
      mutation,
      variables,
    });

    expect(result.errors).toBeFalsy();
    expect(result.data.updatePost.errors).toBeTruthy();
    expect(result.data.updatePost.post).toBeFalsy();
    expect(result.data).toMatchSnapshot();
  });
});
