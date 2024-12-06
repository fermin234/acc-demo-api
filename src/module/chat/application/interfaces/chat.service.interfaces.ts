import { HistoryDto } from '@/module/chat/application/dto/send-message.dto';

export const OPENAI_SERVICE_KEY = 'openai_service';

export interface IChatService {
  sendMessage(
    message: string,
    databaseInfo: any,
    databaseType: string,
    language: string,
    history: HistoryDto[],
  ): Promise<{
    response: string;
    isSqlQuery: boolean;
  }>;
  generateFormalResponse(
    query: string,
    result: any,
    language: string,
  ): Promise<string>;
}
