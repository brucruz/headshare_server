/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserInputError } from 'apollo-server-errors';
import S3StorageProvider from '../shared/providers/StorageProvider/implementations/S3StorageProvider';
import IMedia from './IMedia';
import MediaModel from './MediaModel';
import UploadImageInput from './resolvers/input/UploadImageInput';

export async function uploadImage(
  { file, format, name, description, width, height }: UploadImageInput,
  communityId: any,
): Promise<IMedia> {
  const storageProvider = new S3StorageProvider();

  if (format !== 'image') {
    throw new UserInputError('Invalid media format', { field: 'format' });
  }

  if (!file.name) {
    throw new UserInputError('Filename is missing', { field: 'file.name' });
  }

  if (!file.type) {
    throw new UserInputError('Filetype is missing', { field: 'file.type' });
  }

  const result = await storageProvider.createSignedRequest(
    file.name,
    file.type,
  );

  const media = new MediaModel({
    format,
    url: result.url,
    name,
    description,
    file,
    width,
    height,
    uploadLink: result.signedRequest,
    community: communityId,
  });

  await media.save();

  return media;
}
