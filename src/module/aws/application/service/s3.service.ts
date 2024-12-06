import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import uuid4 from 'uuid4';

import { IUploadFileService } from '@/module/aws/application/interface/upload-file-service.interface';

@Injectable()
export class AmazonS3Service implements IUploadFileService {
  s3: S3Client;
  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get('aws.region'),
      credentials: {
        accessKeyId: this.configService.get('aws.credentials.accessKey'),
        secretAccessKey: this.configService.get(
          'aws.credentials.secretAccessKey',
        ),
      },
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const id = uuid4();
    const positionSlash = file.mimetype.indexOf('/') + 1;
    const key = `${id}.${file.mimetype.slice(positionSlash)}`;

    const command = new PutObjectCommand({
      Bucket: this.configService.get('s3.bucket'),
      Key: `${folder}/${key}`,
      Body: file.buffer,
      ACL: 'public-read',
    });

    await this.s3.send(command);
    return key;
  }
}
