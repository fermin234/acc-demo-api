import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';

import { HistoryDto } from '@/module/chat/application/dto/send-message.dto';
import { IChatService } from '@/module/chat/application/interfaces/chat.service.interfaces';
import { buildQueryInstructions } from '@/module/chat/application/messages/chat.build-query-instructions';
import {
  OPENAI_ERROR,
  OPENAI_GENERATE_FORMAL_ERROR,
  OPENAI_QUOTA_EXCEEDED,
} from '@/module/chat/application/messages/chat.error-messages';

dotenv.config();

@Injectable()
export class ChatService implements IChatService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async sendMessage(
    message: string,
    databaseDetails: any,
    databaseType: string,
    language: string,
    history: HistoryDto[],
  ) {
    try {
      const content = buildQueryInstructions(
        databaseDetails,
        databaseType,
        language,
      );

      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        ...this.createMessagesFromHistory(history),
        { role: 'system', content },
        { role: 'user', content: `user request: ${message}` },
      ];

      const chatCompletion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        temperature: 0.2,
        top_p: 0.1,
        messages,
      });

      return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        throw new HttpException(
          OPENAI_QUOTA_EXCEEDED,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      } else {
        throw new HttpException(OPENAI_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  private createMessagesFromHistory(
    history: HistoryDto[],
  ): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
    return history.map(({ sender, text }) => ({
      role: sender === 'user' ? 'user' : 'assistant',
      content: text,
    }));
  }

  async generateFormalResponse(
    query: string,
    result: any,
    language: string,
  ): Promise<string> {
    try {
      const formattedResult = JSON.stringify(result);
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        temperature: 0.4,
        messages: [
          {
            role: 'system',
            content: `You are an assistant that generates conversational responses based on user queries and SQL results. The SQL result might be in various formats, and your task is to interpret the result correctly and generate a friendly, conversational response. The response must be in the language specified by the language variable: ${language} (examples of possible values: "spanish" for Spanish, "english" for English).

            Make sure the response sounds like a natural conversation, avoiding formal language or structured closings.

            In case the answer contains values that can be represented in json format, you should return those values in json format so that they can be interpreted correctly.
            Do not return the prefix \`\`\`json and the suffix json\`\`\`, just return the array or object normally without enclosing it on them, but still return them as json.
            When the response contains a value that is only a number or is understood to be counting entities, what I want you to return is only a text indicating the amount.
             **Example Outputs**:
            - Give me all the table on the database: Here are the tables: ["book", "book_genre", "genre", "user"]
            - Give me all the books on the database: The books on the database are ["The C Programming Language", "The Lord of The Ring"]
            - Get all the books, with all their properties in a json format: "Here’s all the books in the database:
              [
                {
                  "id": 1,
                  "title": "The C Programming Language",
                  "description": "Introduction to programming",
                  "created_at": "2024-11-01T21:13:15.641Z",
                },
                {
                  "id": 2,
                  "title": "The Lord of The Ring",
                  "description": "Fantasy world",
                  "created_at": "2024-11-01T21:13:15.641Z",
                }
              ]
            `,
          },
          {
            role: 'user',
            content: `Given the query: "${query}" and the SQL result: "${formattedResult}", please generate a formal and correct response. The SQL result may come in various formats, such as an array of objects or simple values.`,
          },
        ],
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      throw new Error(OPENAI_GENERATE_FORMAL_ERROR);
    }
  }
}
