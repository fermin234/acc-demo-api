import { EntitySchema } from 'typeorm';

import { withBaseSchemaColumns } from '@common/base/infrastructure/database/base.schema';

import { Message } from '@/module/queue/message/domain/message.entity';

export const MessageSchema = new EntitySchema<Message>({
  name: 'Message',
  target: Message,
  tableName: 'message',
  columns: withBaseSchemaColumns({
    body: {
      type: String,
    },
    error: {
      type: String,
      default: null,
    },
    messageId: {
      name: 'message_id',
      type: String,
    },
    queueName: {
      name: 'queue_name',
      type: String,
    },
    senderId: {
      name: 'sender_id',
      type: String,
    },
  }),
});
