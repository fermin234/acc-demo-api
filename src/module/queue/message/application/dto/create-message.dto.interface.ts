export interface ICreateMessageDto {
  queueName: string;
  messageId: string;
  body: string;
  senderId: string;
  error?: string | null;
}
