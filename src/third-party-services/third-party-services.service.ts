import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConvertService } from '../common/converters/converter';

@Injectable()
export class ThirdPartyService {
  private readonly s3: AWS.S3;
  private readonly AWS_S3_BUCKET: string;

  constructor(private convertService: ConvertService) {
    this.AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  async getAvatar(key: string): Promise<AWS.S3.DeleteObjectOutput> {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    };
    return this.s3.getObject(params).promise();
  }

  async uploadAvatar(
    buffer: Buffer,
    key: string,
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: 'image/jpeg',
    };
    const upload = this.s3.upload(params);
    return upload.promise();
  }

  async removeAvatar(key: string): Promise<AWS.S3.DeleteObjectOutput> {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    };
    return this.s3.deleteObject(params).promise();
  }

  async updateAvatar(
    buffer: Buffer,
    key: string,
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    await this.removeAvatar(key);
    return this.uploadAvatar(buffer, key);
  }

  async formatConverter(body) {
    const pdfDocBuffer = await this.convertService.generatePdfFromHtml(
      body.url,
      body.type,
    );
    return pdfDocBuffer;
  }
}
