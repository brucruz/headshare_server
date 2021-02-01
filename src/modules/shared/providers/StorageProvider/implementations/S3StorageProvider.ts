import aws, { S3 } from 'aws-sdk';

class S3StorageProvider {
  private client: S3;

  private s3Bucket = 'headshare';

  constructor() {
    this.client = new aws.S3({
      region: 'us-east-1',
    });
  }

  public async createSignedRequest(
    filename: string,
    filetype: string,
  ): Promise<{ signedRequest: string; url: string }> {
    const s3Params = {
      Bucket: this.s3Bucket,
      Key: filename,
      Expires: 60,
      ContentType: filetype,
      ACL: 'public-read',
    };

    const signedRequest = await this.client.getSignedUrlPromise(
      'putObject',
      s3Params,
    );

    const url = `https://${this.s3Bucket}.s3.amazonaws.com/${filename}`;

    return {
      signedRequest,
      url,
    };
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: this.s3Bucket,
        Key: file,
      })
      .promise();
  }
}

export default S3StorageProvider;
