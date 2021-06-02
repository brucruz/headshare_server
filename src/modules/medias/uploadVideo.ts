/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserInputError } from 'apollo-server-errors';
import VimeoVideoProvider from '../shared/providers/VideoProvider/implementations/VimeoVideoProvider';
import IMedia from './IMedia';
import MediaModel from './MediaModel';
import UploadVideoInput from './resolvers/input/UploadVideoInput';

export async function uploadVideo(
  { file, format, name, description }: UploadVideoInput,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  communityId: any,
): Promise<IMedia> {
  const videoProvider = new VimeoVideoProvider();

  if (format !== 'video') {
    throw new UserInputError('Invalid media format', { field: 'format' });
  }

  if (!file.name) {
    throw new UserInputError('Filename is missing', { field: 'file.name' });
  }

  if (!file.size) {
    throw new UserInputError('Filsyze is missing', { field: 'file.size' });
  }

  if (!file.type) {
    throw new UserInputError('Filetype is missing', { field: 'file.type' });
  }

  const result = await videoProvider.createVideo(
    file.name,
    file.size,
    name,
    description,
  );

  const media = new MediaModel({
    format,
    url: `https://player.vimeo.com/video/${result?.uri.split('/')[2]}`,
    name,
    description,
    file,
    uploadLink: result?.upload.upload_link,
    community: communityId,
  });

  await media.save();

  return media;
}
