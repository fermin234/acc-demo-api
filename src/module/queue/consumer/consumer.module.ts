import { SQSClient } from '@aws-sdk/client-sqs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SqsModule } from '@ssut/nestjs-sqs';
import * as AWS from 'aws-sdk';

import { environmentConfig } from '@config/environment.config';

import { MessageModule } from '../message/message.module';
import {
  MAX_MESSAGE_TO_PROCESS_AT_ONCE,
  POLLING_WAIT_TIME_MS,
} from './application/constant/consumer-options.constant';
import { ExampleQueueHandler } from './application/handler/example-queue.handler';
import { ConsumerService } from './application/service/consumer.service';

@Module({
  imports: [
    MessageModule,
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
          consumers: [
            {
              name: configService.get('sqs.queue.name'),
              queueUrl: configService.get('sqs.queue.url'),
              region: configService.get('aws.region'),
              pollingWaitTimeMs: POLLING_WAIT_TIME_MS,
              batchSize: MAX_MESSAGE_TO_PROCESS_AT_ONCE,
              attributeNames: ['All'],
              sqs: sqsClient,
            },
          ],
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      load: [environmentConfig],
    }),
  ],
  controllers: [],
  exports: [ConsumerService, ExampleQueueHandler, ConsumerService],
  providers: [ExampleQueueHandler, ConsumerService],
})
export class ConsumerModule {
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
