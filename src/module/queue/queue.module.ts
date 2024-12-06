import { Module } from '@nestjs/common';

import { ConsumerModule } from './consumer/consumer.module';
import { MessageModule } from './message/message.module';
import { ProducerModule } from './producer/producer.module';

@Module({
  imports: [ProducerModule, MessageModule, ConsumerModule],
  controllers: [],
  providers: [],
})
export class QueueModule {}
