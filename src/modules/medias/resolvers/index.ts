import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { ApolloContext } from '../../../apollo-server/ApolloContext';
import MediaModel from '../MediaModel';
import Media from '../MediaType';
import UploadMediaInput from './input/UploadMediaInput';
import MediaResponse from './MediaResponse';
import MediasResponse from './MediasResponse';
import VimeoVideoProvider from '../../shared/providers/VideoProvider/implementations/VimeoVideoProvider';
import CommunityModel from '../../communities/CommunityModel';
import RoleModel from '../../roles/RoleModel';
import S3StorageProvider from '../../shared/providers/StorageProvider/implementations/S3StorageProvider';
import UploadImageInput from './input/UploadImageInput';

@Resolver(_of => Media)
export default class MediaResolver {
  @Query(() => MediasResponse)
  async medias(): Promise<MediasResponse> {
    const medias = await MediaModel.find({});

    return {
      medias,
    };
  }

  @Query(() => MediaResponse)
  async media(@Arg('id', () => String) id: string): Promise<MediaResponse> {
    const media = await MediaModel.findOne({ _id: id });

    if (!media) {
      return {
        errors: [
          {
            field: 'id',
            message: 'No media found with this id',
          },
        ],
      };
    }

    return {
      media,
    };
  }

  @Mutation(() => MediaResponse, {
    description: 'Users can import a media',
  })
  async uploadVideo(
    @Arg('communitySlug', () => String) communitySlug: string,
    @Arg('videoData', () => UploadMediaInput)
    { format, thumbnailUrl, name, description, file }: UploadMediaInput,
    @Ctx() { req }: ApolloContext,
  ): Promise<MediaResponse> {
    const communityData = await CommunityModel.findOne({ slug: communitySlug });
    const community = communityData?._id;

    if (!community) {
      return {
        errors: [
          {
            field: 'community',
            message:
              'You must be connected to a community to perform this action',
          },
        ],
      };
    }

    const creator = req.session.userId;

    if (!creator) {
      return {
        errors: [
          {
            field: 'auth',
            message: 'You must be logged in to perform this action',
          },
        ],
      };
    }

    const isCreator = await RoleModel.isCreator(creator, community);

    if (!isCreator) {
      return {
        errors: [
          {
            field: 'role',
            message: 'Only community creators may perform this action',
          },
        ],
      };
    }

    if (format !== 'video') {
      return {
        errors: [
          {
            field: 'format',
            message: 'Invalid media format',
          },
        ],
      };
    }

    const videoProvider = new VimeoVideoProvider();

    if (!file.name) {
      return {
        errors: [
          {
            field: 'fileName',
            message: 'Filename is missing',
          },
        ],
      };
    }

    if (!file.size) {
      return {
        errors: [
          {
            field: 'fileSize',
            message: 'Filesize is missing',
          },
        ],
      };
    }

    try {
      const result = await videoProvider.createVideo(
        file.name,
        file.size,
        name,
        description,
      );

      const media = new MediaModel({
        format,
        url: `https://player.vimeo.com/video/${result?.uri.split('/')[2]}`,
        thumbnailUrl,
        name,
        description,
        file,
        uploadLink: result?.upload.upload_link,
        community,
      });

      await media.save();

      return {
        media,
      };
    } catch (err) {
      return {
        errors: [
          {
            field: 'none',
            message: err,
          },
        ],
      };
    }
  }

  @Mutation(() => MediaResponse, {
    description: 'Users can import a media',
  })
  async uploadImage(
    @Arg('communitySlug', () => String) communitySlug: string,
    @Arg('imageData', () => UploadImageInput)
    {
      format,
      thumbnailUrl,
      name,
      description,
      file,
      width,
      height,
    }: UploadImageInput,
    @Ctx() { req }: ApolloContext,
  ): Promise<MediaResponse> {
    const communityData = await CommunityModel.findOne({ slug: communitySlug });
    const community = communityData?._id;

    if (!community) {
      return {
        errors: [
          {
            field: 'community',
            message:
              'You must be connected to a community to perform this action',
          },
        ],
      };
    }

    const creator = req.session.userId;

    if (!creator) {
      return {
        errors: [
          {
            field: 'auth',
            message: 'You must be logged in to perform this action',
          },
        ],
      };
    }

    const isCreator = await RoleModel.isCreator(creator, community);

    if (!isCreator) {
      return {
        errors: [
          {
            field: 'role',
            message: 'Only community creators may perform this action',
          },
        ],
      };
    }

    if (format !== 'image') {
      return {
        errors: [
          {
            field: 'format',
            message: 'Invalid media format',
          },
        ],
      };
    }

    const storageProvider = new S3StorageProvider();

    if (!file.name) {
      return {
        errors: [
          {
            field: 'fileName',
            message: 'Filename is missing',
          },
        ],
      };
    }

    if (!file.type) {
      return {
        errors: [
          {
            field: 'fileType',
            message: 'Filetype is missing',
          },
        ],
      };
    }

    try {
      const result = await storageProvider.createSignedRequest(
        file.name,
        file.type,
      );

      const media = new MediaModel({
        format,
        url: result.url,
        thumbnailUrl,
        name,
        description,
        file,
        width,
        height,
        uploadLink: result.signedRequest,
        community,
      });

      await media.save();

      return {
        media,
      };
    } catch (err) {
      return {
        errors: [
          {
            field: 'none',
            message: err,
          },
        ],
      };
    }
  }
}
