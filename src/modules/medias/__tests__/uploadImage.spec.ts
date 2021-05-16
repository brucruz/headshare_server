import { UserInputError } from 'apollo-server-errors';
import { createCommunity, createUser } from '../../../test/createRows';
import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
} from '../../../test/testRun';
import { MediaFormat } from '../IMedia';
import FileInput from '../resolvers/input/FileInput';
import { uploadImage } from '../uploadImage';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

describe('a image', () => {
  it('should be able to be uploaded', async () => {
    const format = MediaFormat.IMAGE;
    const file: FileInput = {
      name: 'test.jpg',
      type: 'jpg',
    };
    const userId = (await createUser())._id.toString();
    const community = await createCommunity({}, userId);
    const communityId = community._id.toString();

    const media = await uploadImage(
      {
        format,
        file,
      },
      communityId,
    );

    expect(media._id).toBeTruthy();
    expect(media.file).toEqual(file);
  });

  it('should not be able to be uploaded, if format is not image', async () => {
    const format = MediaFormat.VIDEO;
    const file: FileInput = {
      name: 'test.jpg',
      type: 'jpg',
    };
    const userId = (await createUser())._id.toString();
    const community = await createCommunity({}, userId);
    const communityId = community._id.toString();

    await expect(
      uploadImage(
        {
          format,
          file,
        },
        communityId,
      ),
    ).rejects.toBeInstanceOf(UserInputError);
  });

  it('should not be able to be uploaded, if file name or type is not informed', async () => {
    const format = MediaFormat.VIDEO;
    const fileWithoutName: FileInput = {
      name: undefined,
      type: 'jpg',
    };
    const fileWithoutType: FileInput = {
      name: 'test.jpg',
      type: undefined,
    };
    const userId = (await createUser())._id.toString();
    const community = await createCommunity({}, userId);
    const communityId = community._id.toString();

    await expect(
      uploadImage(
        {
          format,
          file: fileWithoutName,
        },
        communityId,
      ),
    ).rejects.toBeInstanceOf(UserInputError);
    await expect(
      uploadImage(
        {
          format,
          file: fileWithoutType,
        },
        communityId,
      ),
    ).rejects.toBeInstanceOf(UserInputError);
  });
});
