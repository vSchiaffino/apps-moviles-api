import {
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

@Injectable()
export class AwsService {
  private readonly s3: S3Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.getOrThrow<string>('AWS_BUCKET_NAME');
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const fileName = `${randomUUID()}`;

    const uploadParams = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const result: PutObjectCommandOutput = await this.s3.send(
      new PutObjectCommand(uploadParams),
    );
    if (
      !result.$metadata.httpStatusCode ||
      result.$metadata.httpStatusCode !== 200
    ) {
      throw new Error('Error uploading file to S3');
    }
    return `https://${this.bucketName}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${fileName}`;
  }
}
