import {
  CreateTopicCommand,
  CreateTopicCommandOutput,
  DeleteTopicCommand,
  DeleteTopicCommandOutput,
  ListTopicsCommand,
  ListTopicsCommandOutput,
  PublishCommand,
  PublishCommandOutput,
  SNSClient,
  SubscribeCommand,
  SubscribeCommandOutput,
  UnsubscribeCommand,
  UnsubscribeCommandOutput,
} from '@aws-sdk/client-sns';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IMessageService } from '@/module/aws/application/interface/message-service.interface';

@Injectable()
export class AmazonSNSService implements IMessageService {
  private snsClient: SNSClient;

  constructor(private readonly configService: ConfigService) {
    this.snsClient = new SNSClient({
      region: this.configService.get<string>('aws.region'),
      credentials: {
        accessKeyId: this.configService.get<string>(
          'aws.credentials.accessKeyId',
        ),
        secretAccessKey: this.configService.get<string>(
          'aws.credentials.secretAccessKey',
        ),
      },
    });
  }

  async publishMessage(
    message: string,
    topicArn: string,
  ): Promise<PublishCommandOutput> {
    const command = new PublishCommand({
      Message: message,
      TopicArn: topicArn,
    });
    return this.snsClient.send(command);
  }

  async listTopics(): Promise<ListTopicsCommandOutput> {
    const command = new ListTopicsCommand({});
    return this.snsClient.send(command);
  }

  async createTopic(topicName: string): Promise<CreateTopicCommandOutput> {
    const command = new CreateTopicCommand({
      Name: topicName,
    });
    return this.snsClient.send(command);
  }

  async deleteTopic(topicArn: string): Promise<DeleteTopicCommandOutput> {
    const command = new DeleteTopicCommand({
      TopicArn: topicArn,
    });
    return this.snsClient.send(command);
  }

  async subscribe(
    topicArn: string,
    protocol: string,
    endpoint: string,
  ): Promise<SubscribeCommandOutput> {
    const command = new SubscribeCommand({
      TopicArn: topicArn,
      Protocol: protocol,
      Endpoint: endpoint,
    });
    return this.snsClient.send(command);
  }

  async unsubscribe(
    subscriptionArn: string,
  ): Promise<UnsubscribeCommandOutput> {
    const command = new UnsubscribeCommand({
      SubscriptionArn: subscriptionArn,
    });
    return this.snsClient.send(command);
  }
}
