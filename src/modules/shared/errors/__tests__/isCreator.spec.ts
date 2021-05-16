import { AuthenticationError, ForbiddenError } from 'apollo-server-errors';
import { ObjectId } from 'mongodb';
import { createCommunity, createUser } from '../../../../test/createRows';
import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
} from '../../../../test/testRun';
import { isCreator } from '../isCreator';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

describe('a user', () => {
  it('informing a community slug, should return his community if he is its creator', async () => {
    const userId = (await createUser())._id.toString();
    const community = await createCommunity({}, userId);
    const communityId = community._id.toString();
    const communitySlug = community.slug;

    const communityVersionSlug = await isCreator(
      { slug: communitySlug },
      userId,
    );
    const communityVersionId = await isCreator({ _id: communityId }, userId);

    expect(communityVersionSlug.slug).toEqual(communitySlug);
    expect(communityVersionId._id.toString()).toEqual(communityId);
  });

  it('should get an error back if he is not creator of the informed community', async () => {
    const userId = (await createUser())._id.toString();
    const creatorId = (await createUser())._id.toString();
    const community = await createCommunity({}, creatorId);
    const communityId = community._id.toString();
    const communitySlug = community.slug;

    await expect(
      isCreator({ slug: communitySlug }, userId),
    ).rejects.toBeInstanceOf(ForbiddenError);

    await expect(
      isCreator({ _id: communityId }, userId),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('not informing its credentials should get an error back', async () => {
    const userId = (await createUser())._id.toString();
    const community = await createCommunity({}, userId);
    const communityId = community._id.toString();
    const communitySlug = community.slug;

    await expect(isCreator({ slug: communitySlug })).rejects.toBeInstanceOf(
      AuthenticationError,
    );

    await expect(isCreator({ _id: communityId })).rejects.toBeInstanceOf(
      AuthenticationError,
    );
  });

  it('informing a invalid community Id should get an error back', async () => {
    const userId = (await createUser())._id.toString();
    const communityId = new ObjectId().toString(); // non-existent-community;
    const communitySlug = 'non-existent-community';

    await expect(
      isCreator({ slug: communitySlug }, userId),
    ).rejects.toBeInstanceOf(ForbiddenError);

    await expect(
      isCreator({ _id: communityId }, userId),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});
