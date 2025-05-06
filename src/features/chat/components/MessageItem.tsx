import React from "react";
import styled from "@emotion/styled";
import { renderMarkdown } from "../../markdown";
import type { Message } from "../types";

interface MessageItemProps {
	message: Message;
}

/**
 * Styled container for user messages
 */
const UserMessageContainer = styled.div`
  background-color: #e9f5ff;
  padding: 12px 18px;
  border-radius: 8px;
  margin: 8px 0;
  align-self: flex-end;
  max-width: 80%;
`;

/**
 * Styled container for assistant messages
 */
const AssistantMessageContainer = styled.div`
  background-color: #f8f8f8;
  padding: 12px 18px;
  border-radius: 8px;
  margin: 8px 0;
  align-self: flex-start;
  max-width: 80%;
`;

/**
 * Styled content area for markdown-rendered text
 */
const MessageContent = styled.div`
  pre {
    background-color: #f0f0f0;
    padding: 8px;
    border-radius: 4px;
    overflow-x: auto;
  }

  code {
    font-family: "Courier New", monospace;
    font-size: 0.9em;
    background-color: #f0f0f0;
    padding: 2px 4px;
    border-radius: 3px;
  }

  p {
    margin: 0.5em 0;
  }

  p:first-of-type {
    margin-top: 0;
  }

  p:last-of-type {
    margin-bottom: 0;
  }

  img {
    max-width: 100%;
  }

  .math-block {
    overflow-x: auto;
    margin: 1em 0;
  }
`;

/**
 * Component for rendering a single chat message with appropriate styling.
 * Uses different styles for user vs. assistant messages and renders markdown content.
 *
 * @param props - Component properties containing the message to display
 * @returns Rendered message component
 */
export const MessageItem = React.memo(({ message }: MessageItemProps) => {
	const Container =
		message.role === "user" ? UserMessageContainer : AssistantMessageContainer;

	return (
		<Container>
			{message.role === "user" ? (
				<MessageContent>{message.content}</MessageContent>
			) : (
				<MessageContent
					dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
				/>
			)}
		</Container>
	);
});
