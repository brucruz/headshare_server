import axios from 'axios';
import mime from 'mime';
import VimeoUploadResponse from '../dtos/VimeoUploadResponse';

export default class VimeoVideoProvider {
  private accessToken = process.env.VIMEO_ACCESS_TOKEN;

  public async createVideo(
    fileName: string,
    fileSize: number,
    name?: string,
    description?: string,
  ): Promise<VimeoUploadResponse | undefined> {
    function getExtension(file: string) {
      const splittedFileName = file.split('.');

      const extensionIndex = splittedFileName.length - 1;

      return splittedFileName[extensionIndex];
    }

    const ContentType = mime.getType(getExtension(fileName));

    if (!ContentType) {
      throw new Error('File not found');
    }

    // MP4, MOV, WMV, AVI, and FLV

    try {
      const response = await axios.post<VimeoUploadResponse>(
        `https://api.vimeo.com/me/videos`,
        {
          name: name || fileName,
          description,
          upload: {
            approach: 'tus',
            mime_type: ContentType,
            size: fileSize,
          },
          embed: {
            buttons: {
              embed: false,
              like: false,
              share: false,
              watchlater: false,
            },
            color: '#E74F4F',
            logos: {
              custom: {
                active: false,
              },
              vimeo: false,
            },
            title: {
              name: 'hide',
              owner: 'hide',
              portrait: 'hide',
            },
          },
        },
        {
          headers: {
            Authorization: `bearer ${this.accessToken}`,
            'Content-Type': '	application/json',
            Accept: 'application/vnd.vimeo.*+json;version=3.4',
          },
        },
      );

      return response.data;
    } catch (err) {
      console.log(err);

      return undefined;
    }
  }
}
