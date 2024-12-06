import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ISendResponse } from '@/module/chat/application/interfaces/chat.controller.intefaces';
import { ERROR_PROCESSING } from '@/module/chat/application/messages/chat.error-messages';
import { ChatService } from '@/module/chat/application/service/chat.service';
import { DATABASE_SERVICE_KEY } from '@/module/db/application/interfaces/database.service.interfaces';
import { DatabaseService } from '@/module/db/application/service/database.service';
import { getDatabaseType } from '@/module/db/application/utils/database.utils';

import { SendMessageDto } from '../application/dto/send-message.dto';
import { OPENAI_SERVICE_KEY } from '../application/interfaces/chat.service.interfaces';

@Controller('chat')
@ApiTags('book')
export class ChatController {
  constructor(
    @Inject(OPENAI_SERVICE_KEY)
    private readonly chatService: ChatService,
    @Inject(DATABASE_SERVICE_KEY)
    private readonly databaseService: DatabaseService,
  ) {}

  @Post('send')
  async sendMessage(
    @Body() sendMessageDto: SendMessageDto,
  ): Promise<ISendResponse> {
    const { message, language, databaseInfo, history } = sendMessageDto;

    try {
      const { response, isSqlQuery } = await this.chatService.sendMessage(
        message,
        databaseInfo,
        getDatabaseType(),
        language,
        history,
      );

      let result = undefined;

      if (isSqlQuery)
        result = await this.databaseService.executeQuery(response);

      const formalResponse = await this.chatService.generateFormalResponse(
        message,
        result !== undefined ? result : response,
        language,
      );

      return { response: formalResponse };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        ERROR_PROCESSING,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
