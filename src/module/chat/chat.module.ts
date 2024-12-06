import { Module } from '@nestjs/common';

import { OPENAI_SERVICE_KEY } from '@/module/chat/application/interfaces/chat.service.interfaces';
import { ChatService } from '@/module/chat/application/service/chat.service';
import { ChatController } from '@/module/chat/interface/chat.controller';
import { DATABASE_SERVICE_KEY } from '@/module/db/application/interfaces/database.service.interfaces';
import { DatabaseService } from '@/module/db/application/service/database.service';
import { DatabaseController } from '@/module/db/interface/database.controller';

@Module({
  controllers: [ChatController],
  providers: [
    {
      provide: OPENAI_SERVICE_KEY,
      useClass: ChatService,
    },
    {
      provide: DATABASE_SERVICE_KEY,
      useClass: DatabaseService,
    },
    DatabaseController,
  ],
  exports: [
    {
      provide: OPENAI_SERVICE_KEY,
      useClass: ChatService,
    },
  ],
})
export class ChatModule {}
