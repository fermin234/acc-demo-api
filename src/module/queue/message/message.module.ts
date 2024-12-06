import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessageMapper } from '@/module/queue/message/application/mapper/message.mapper';
import { MESSAGE_REPOSITORY_KEY } from '@/module/queue/message/application/repository/message.repository.interface';
import { MessageService } from '@/module/queue/message/application/service/message.service';
import { MessageMySqlRepository } from '@/module/queue/message/infrastructure/database/message.mysql.repository';
import { MessageSchema } from '@/module/queue/message/infrastructure/database/message.schema';

import { ProducerModule } from '../producer/producer.module';

const messageRepositoryProvider: Provider = {
  provide: MESSAGE_REPOSITORY_KEY,
  useClass: MessageMySqlRepository,
};

@Module({
  imports: [ProducerModule, TypeOrmModule.forFeature([MessageSchema])],
  providers: [MessageService, MessageMapper, messageRepositoryProvider],
  controllers: [],
  exports: [MessageService, MessageMapper, messageRepositoryProvider],
})
export class MessageModule {}
