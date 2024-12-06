import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SqsConsumerEventHandler, SqsMessageHandler } from '@ssut/nestjs-sqs';

import { ConsumerService } from '../service/consumer.service';

@Injectable()
export class ExampleQueueHandler {
  constructor(private readonly consumerService: ConsumerService) {}

  @SqsMessageHandler(process.env.SQS_QUEUE_NAME, false)
  async handleMessage(message: AWS.SQS.Message) {
    try {
      await this.consumerService.processMessage(
        message,
        process.env.SQS_QUEUE_NAME,
      );
    } catch (error) {
      await this.consumerService.processMessage(
        {
          ...message,
          error: JSON.stringify(error.message),
        },
        process.env.SQS_QUEUE_NAME,
      );
    }
  }

  @SqsConsumerEventHandler(process.env.SQS_QUEUE_NAME, 'processing_error')
  public onProcessingError(error: Error) {
    throw new InternalServerErrorException(
      `Error processing received message from SQS: ${error}`,
    );
  }
}
