export interface IMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}
