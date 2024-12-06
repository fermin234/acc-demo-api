import { IMessage } from './IMessage';

export interface IChatBoxProps {
  messages: IMessage[];
  input: string;
  messageLoading: boolean;
  handleSend: () => Promise<void>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}
