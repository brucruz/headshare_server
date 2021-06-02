import { UserInputError } from 'apollo-server-errors';
import { createCommunity, createUser } from '../../../test/createRows';
import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
} from '../../../test/testRun';
import { MediaFormat } from '../IMedia';
import FileInput from '../resolvers/input/FileInput';
import { uploadVideo } from '../uploadVideo';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

describe('a video', () => {
  it('should be able to be uploaded', async () => {
    const format = MediaFormat.VIDEO;
    const file: FileInput = {
      name: 'test.mov',
      type: 'mov',
      size: 1024,
    };
    const userId = (await createUser())._id.toString();
    const community = await createCommunity({}, userId);
    const communityId = community._id.toString();

    const media = await uploadVideo(
      {
        format,
        file,
      },
      communityId,
    );

    expect(media._id).toBeTruthy();
    expect(media.file).toEqual(file);
  });

  it('should not be able to be uploaded, if format is not video', async () => {
    const format = MediaFormat.IMAGE;
    const file: FileInput = {
      name: 'test.mov',
      type: 'mov',
      size: 1024,
    };
    const userId = (await createUser())._id.toString();
    const community = await createCommunity({}, userId);
    const communityId = community._id.toString();

    await expect(
      uploadVideo(
        {
          format,
          file,
        },
        communityId,
      ),
    ).rejects.toBeInstanceOf(UserInputError);
  });

  it('should not be able to be uploaded, if file name or type or size is not informed', async () => {
    const format = MediaFormat.VIDEO;
    const fileWithoutName: FileInput = {
      name: undefined,
      type: 'mov',
      size: 1024,
    };
    const fileWithoutType: FileInput = {
      name: 'test.mov',
      type: undefined,
      size: 1024,
    };
    const fileWithoutSize: FileInput = {
      name: 'test.mov',
      type: 'mov',
      size: undefined,
    };
    const userId = (await createUser())._id.toString();
    const community = await createCommunity({}, userId);
    const communityId = community._id.toString();

    await expect(
      uploadVideo(
        {
          format,
          file: fileWithoutName,
        },
        communityId,
      ),
    ).rejects.toBeInstanceOf(UserInputError);
    await expect(
      uploadVideo(
        {
          format,
          file: fileWithoutType,
        },
        communityId,
      ),
    ).rejects.toBeInstanceOf(UserInputError);
    await expect(
      uploadVideo(
        {
          format,
          file: fileWithoutSize,
        },
        communityId,
      ),
    ).rejects.toBeInstanceOf(UserInputError);
  });
});
