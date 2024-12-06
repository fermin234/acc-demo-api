import { Injectable } from '@nestjs/common';

import { ICreateMessageDto } from '@/module/queue/message/application/dto/create-message.dto.interface';
import { MessageResponseDto } from '@/module/queue/message/application/dto/message-response.dto';
import { Message } from '@/module/queue/message/domain/message.entity';

import { CreateMessageDto } from '../dto/create-message.dto';

@Injectable()
export class MessageMapper {
  fromCreateMessageDtoToMessage(messageDto: ICreateMessageDto): Message {
    const message = new Message();
    message.body = messageDto.body;
    message.messageId = messageDto.messageId;
    message.queueName = messageDto.queueName;
    message.senderId = messageDto.senderId;
    message.error = messageDto.error;

    return message;
  }

  fromQueueMessageToMessageDto(
    queueMessage: AWS.SQS.Message,
    queueName: string,
  ): ICreateMessageDto {
    const message = new CreateMessageDto();
    message.body = queueMessage.Body;
    message.senderId = queueMessage.Attributes['SenderId'];
    message.messageId = queueMessage.MessageId;
    message.queueName = queueName;

    return message;
  }

  fromMessageToMessageResponseDto(message: Message): MessageResponseDto {
    const messageResponseDto = new MessageResponseDto();
    messageResponseDto.id = message.id;
    messageResponseDto.messageId = message.messageId;
    messageResponseDto.queueName = message.queueName;
    messageResponseDto.error = message.error;
    messageResponseDto.body = message.body;
    messageResponseDto.createdAt = message.createdAt;
    messageResponseDto.updatedAt = message.updatedAt;
    messageResponseDto.deletedAt = message.deletedAt;
    return messageResponseDto;
  }
}
