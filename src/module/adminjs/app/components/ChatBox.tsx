import React, { useEffect, FC, useRef } from 'react';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp';

import { IChatBoxProps } from '../interfaces/chat/IChatBoxProps';
import { MessageLoading } from './MessageLoading';
import ChatBubble from './ChatBubble';

const ChatContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 10px 16px 30px 16px;
  box-shadow: 0 4px 6px #0000001a;
  background-color: #0c1827;
`;

const MessagesContainer = styled.div`
  margin-bottom: 16px;
  padding: 8px;
  padding-left: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  row-gap: 3px;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const ChatInput = styled.input`
  width: 50%;
  height: 48px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 0.375rem 0 0 0.375rem;
  font-size: 1.125rem;
  &:placeholder {
    color: #9ca3af;
  }
`;

const SendButton = styled.button`
  padding: 8px;
  width: 48px;
  background-color: #3b82f6;
  color: white;
  border-radius: 0 0.375rem 0.375rem 0;
  transition: background-color 0.2s;
  border: 1px;

  &:hover {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #bfdbfe;
  }
`;

const ChatBox: FC<IChatBoxProps> = ({
  messages,
  input,
  messageLoading,
  handleSend,
  handleInputChange,
  handleKeyDown,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.map((msg) => (
          <ChatBubble msg={msg} key={msg.id} />
        ))}

        {messageLoading && <MessageLoading />}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputContainer>
        <ChatInput
          type="text"
          value={input}
          data-test="chat-input"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={messageLoading}
        />
        <SendButton
          onClick={handleSend}
          data-test="chat-send-button"
          disabled={messageLoading || input.length === 0}
        >
          <FontAwesomeIcon icon={faArrowUp} size="xl" />
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatBox;
