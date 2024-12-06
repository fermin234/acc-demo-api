import React from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
     opacity: 0.5;
  }
`;

const MessageLoadingContainer = styled.div`
  justify-content: flex-start;
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  max-width: 320px;
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
`;

const ChatBotText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: white;
  line-height: 1.25rem;
`;

const MessageBody = styled.div`
  background-color: #2d3748;
  display: flex;
  flex-direction: column;
  line-height: 1.5;
  padding: 16px;
  border-radius: 0.75rem;
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 4px;
`;

const Dot = styled.div<{ delay: string }>`
  width: 10px;
  height: 10px;
  background-color: white;
  border-radius: 50%;
  animation: ${pulse} 1.5s infinite;
  animation-delay: ${({ delay }) => delay};
`;

export const MessageLoading = () => {
  return (
    <MessageLoadingContainer>
      <MessageContent>
        <MessageHeader>
          <ChatBotText>Chat bot</ChatBotText>
        </MessageHeader>
        <MessageBody>
          <LoadingDots>
            <Dot delay="0ms" />
            <Dot delay="200ms" />
            <Dot delay="400ms" />
          </LoadingDots>
        </MessageBody>
      </MessageContent>
    </MessageLoadingContainer>
  );
};
