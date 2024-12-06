import {
  UnsubscribeCommandOutput,
  SubscribeCommandOutput,
  DeleteTopicCommandOutput,
  CreateTopicCommandOutput,
  ListTopicsCommandOutput,
  PublishCommandOutput,
} from '@aws-sdk/client-sns';

export interface IMessageService {
  publishMessage(
    message: string,
    topicArn: string,
  ): Promise<PublishCommandOutput>;
  listTopics(): Promise<ListTopicsCommandOutput>;
  createTopic(topicName: string): Promise<CreateTopicCommandOutput>;
  deleteTopic(topicArn: string): Promise<DeleteTopicCommandOutput>;
  subscribe(
    topicArn: string,
    protocol: string,
    endpoint: string,
  ): Promise<SubscribeCommandOutput>;
  unsubscribe(subscriptionArn: string): Promise<UnsubscribeCommandOutput>;
}
