import React from 'react';
import styled from 'styled-components';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons/faAngleLeft';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons/faAngleRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SidebarContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen: boolean }>`
  position: absolute;
  background: linear-gradient(to right, rgb(5, 10, 17), rgb(5, 10, 17));
  width: 25%;
  padding: 1rem;
  color: white;
  height: 100%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition:
    transform 0.3s ease-in-out,
    width 0.3s ease-in-out,
    padding 0.3s ease-in-out;
  transform: ${({ isOpen }) =>
    isOpen ? 'translateX(0)' : 'translateX(-100%)'};
`;

const Content = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen: boolean }>`
  line-height: 1.7;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  transition: opacity 0.3s ease-in-out;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
`;

const Heading = styled.h3`
  text-align: center;
  font-weight: bold;
  font-size: 1.125rem;
  margin-bottom: 1rem;
`;

const Paragraph = styled.p`
  margin-bottom: 0.5rem;
`;

const OrderedList = styled.ol`
  list-style-type: decimal;
  list-style-position: inside;
  margin-bottom: 1rem;
`;

const ListItem = styled.li`
  margin-bottom: 0.5rem;
  strong {
    font-weight: 700;
  }
`;

const UnorderedList = styled.ul`
  list-style-type: disc;
  list-style-position: inside;
  margin-left: 1rem;
`;

const ToggleButton = styled.button`
  cursor: pointer;
  position: absolute;
  top: 50%;
  right: -24px;
  transform: translateY(-50%);
  background-color: white;
  color: #1e40af;
  border-radius: 999px;
  padding: 8px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: background-color 0.2s;
  border: none;
  z-index: 10;

  &:hover {
    background-color: #e5e7eb;
  }
`;

function SideBar({ isOpen, open }: { isOpen: boolean; open: () => void }) {
  return (
    <SidebarContainer isOpen={isOpen}>
      <Content isOpen={isOpen}>
        <Heading>How to Use the Chat with the Database</Heading>
        <Paragraph>
          Our app includes a chat feature powered by OpenAI, which allows you to
          interact with your database using natural language. Here's how it
          works:
        </Paragraph>
        <OrderedList>
          <ListItem>
            <strong>Ask Specific Questions:</strong> The chat reads your
            question, converts it into an SQL query, and injects the query into
            the database. The result is processed by OpenAI to provide you with
            a formal response based on the data retrieved.
          </ListItem>
          <ListItem>
            <strong>Be Clear and Precise:</strong> It's important to ask
            specific and understandable questions. If you receive an error, it
            may be due to providing an incorrect table name or property in your
            question.
          </ListItem>
          <ListItem>
            <strong>Common Errors:</strong> If the chat returns an error, it
            might be because of:
            <UnorderedList>
              <li>Incorrect database model names.</li>
              <li>Invalid column/property names.</li>
            </UnorderedList>
          </ListItem>
          <ListItem>
            <strong>Example Questions:</strong>
            <UnorderedList>
              <li>"What is the total number of users?"</li>
              <li>"Show me the orders placed in the last 7 days."</li>
            </UnorderedList>
          </ListItem>
        </OrderedList>
        <Paragraph>
          By following these steps, you can effectively retrieve information
          from the database. Just ensure your questions are as clear and
          detailed as possible!
        </Paragraph>
      </Content>

      {/* Button to toggle sidebar */}
      <ToggleButton onClick={open}>
        {isOpen ? (
          <FontAwesomeIcon color="#2563EB" icon={faAngleLeft} size="2xl" />
        ) : (
          <FontAwesomeIcon color="#2563EB" icon={faAngleRight} size="2xl" />
        )}
      </ToggleButton>
    </SidebarContainer>
  );
}

export default SideBar;
