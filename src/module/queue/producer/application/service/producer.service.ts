import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SqsService } from '@ssut/nestjs-sqs';
import { v4 } from 'uuid';

@Injectable()
export class ProducerService {
  constructor(private readonly sqsService: SqsService) {}
  async sendMessage<T>(messageData: T, queueName: string) {
    try {
      await this.sqsService.send(queueName, {
        id: v4(),
        body: JSON.stringify(messageData),
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error sending SQS message, queueName: ' + queueName,
        error,
      );
    }
  }
}
