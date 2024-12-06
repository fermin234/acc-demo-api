import { Message } from '@/module/queue/message/domain/message.entity';

export const MESSAGE_REPOSITORY_KEY = 'message_repository';

export interface IMessageRepository {
  saveOne(message: Message): Promise<Message>;
}
