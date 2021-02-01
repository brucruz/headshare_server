import { Document } from 'mongoose';
import { registerEnumType } from 'type-graphql';
import Community from '../communities/CommunityType';

// eslint-disable-next-line no-shadow
export enum MediaFormat {
  VIDEO = 'video',
  IMAGE = 'image',
  AUDIO = 'audio',
}

registerEnumType(MediaFormat, {
  name: 'MediaFormat',
  description: 'The possible formats a media might have',
  valuesConfig: {
    VIDEO: {
      description: 'Image and audio content',
    },
    IMAGE: {
      description: 'Image only content',
    },
    AUDIO: {
      description: 'Audio only content',
    },
  },
});

export interface IFile {
  name?: string;
  size?: number;
  extension?: string;
  type?: string;
}

export default interface IMedia extends Document {
  format: MediaFormat;
  url: string;
  thumbnailUrl?: string;
  name?: string;
  description?: string;
  file: IFile;
  uploadLink: string;
  community: Community;
  isActive: boolean;
  removedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
