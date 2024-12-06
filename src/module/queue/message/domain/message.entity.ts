import { Base } from '@common/base/domain/base.entity';

export class Message extends Base {
  queueName: string;
  messageId: string;
  body: string;
  senderId: string;
  error: string | null;
}
