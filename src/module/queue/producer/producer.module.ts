import { SQSClient } from '@aws-sdk/client-sqs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SqsModule } from '@ssut/nestjs-sqs';
import * as AWS from 'aws-sdk';

import { environmentConfig } from '@config/environment.config';

import { ProducerService } from './application/service/producer.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [environmentConfig],
    }),
    SqsModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const sqsClient = new SQSClient({
          credentials: {
            accessKeyId: configService.get('aws.credentials.accessKeyId'),
            secretAccessKey: configService.get(
              'aws.credentials.secretAccessKey',
            ),
          },
          region: configService.get('aws.region'),
          endpoint: configService.get('sqs.endpoint'),
        });
        return {
          producers: [
            {
              name: configService.get('sqs.queue.name'),
              queueUrl: configService.get('sqs.queue.url'),
              region: configService.get('aws.region'),
              sqs: sqsClient,
            },
          ],
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  exports: [ProducerService],
  providers: [ProducerService],
})
export class ProducerModule {
  constructor(private configService: ConfigService) {
    AWS.config.update({
      region: this.configService.get('aws.region'),
      accessKeyId: this.configService.get('aws.credentials.accessKeyId'),
      secretAccessKey: this.configService.get(
        'aws.credentials.secretAccessKey',
      ),
    });
  }
}
