import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import styled from 'styled-components';

import { IMessage } from '../interfaces/chat/IMessage';

const Container = styled.div<{ isUser: boolean }>`
  display: flex;
  justify-content: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
  align-items: start;
  gap: 10px;
`;

const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  max-width: 620px;
`;

const SenderNameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SenderName = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: white;
  line-height: 1.75rem;
`;

const ChatBubbleContainer = styled.div<{ isUser: boolean }>`
  background-color: ${({ isUser }) => (isUser ? '#93C5FD' : '#3B82F6')};
  padding: 16px;
  border-end-start-radius: 0.75rem;
  border-start-end-radius: 0.75rem;
  border-end-end-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  line-height: 1.5;
  font-size: 16px;

  pre {
    margin: 0;
    overflow-x: auto;
  }
`;

const ChatBubble = ({ msg }: { msg: IMessage }) => {
  const jsonContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (jsonContainerRef.current) {
      hljs.highlightBlock(jsonContainerRef.current);
    }
  }, []);

  const extractTextAndJson = (text: string) => {
    const jsonMatch = text.match(/(\[.*\]|\{.*\})/s);
    if (jsonMatch) {
      const textBeforeJson = text.substring(0, jsonMatch.index).trim();
      const jsonString = jsonMatch[0];
      return { textBeforeJson, jsonString };
    }
    return { textBeforeJson: text, jsonString: null };
  };

  const { textBeforeJson, jsonString } = extractTextAndJson(msg.text);

  return (
    <Container isUser={msg.sender === 'user'}>
      <MessageContent>
        <SenderNameContainer>
          <SenderName>{msg.sender === 'user' ? 'You' : 'Chat bot'}</SenderName>
        </SenderNameContainer>
        <ChatBubbleContainer isUser={msg.sender === 'user'}>
          <p>{textBeforeJson}</p>
          {jsonString && (
            <pre>
              <code
                ref={jsonContainerRef}
                className="json"
                dangerouslySetInnerHTML={{
                  __html: hljs.highlightAuto(jsonString).value,
                }}
              />
            </pre>
          )}
        </ChatBubbleContainer>
      </MessageContent>
    </Container>
  );
};

export default ChatBubble;
