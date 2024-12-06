import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IMessageRepository } from '@/module/queue/message/application/repository/message.repository.interface';
import { Message } from '@/module/queue/message/domain/message.entity';
import { MessageSchema } from '@/module/queue/message/infrastructure/database/message.schema';

export class MessageMySqlRepository implements IMessageRepository {
  constructor(
    @InjectRepository(MessageSchema)
    private readonly repository: Repository<Message>,
  ) {}

  async saveOne(message: Message): Promise<Message> {
    return this.repository.save(message);
  }
}
