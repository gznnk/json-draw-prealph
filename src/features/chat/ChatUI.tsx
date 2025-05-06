import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { OpenAIService } from "./services/OpenAIService";
import { MessageItem } from "./components/MessageItem";
import type { Message, ChatUIProps } from "./types";

/**
 * Container for the entire chat interface
 */
const ChatContainer = styled.div<{ width?: string; height?: string }>`
  display: flex;
  flex-direction: column;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  overflow: hidden;
  width: ${({ width }) => width || "600px"};
  height: ${({ height }) => height || "500px"};
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

/**
 * Header area for the chat
 */
const ChatHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #e1e1e1;
  background-color: #f7f7f7;
  display: flex;
  align-items: center;
`;

/**
 * Avatar for the AI assistant
 */
const AssistantAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #10a37f;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: white;
  font-weight: bold;
  font-size: 14px;
`;

/**
 * Title for the chat header
 */
const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #333;
`;

/**
 * Messages display area with scrolling
 */
const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  scroll-behavior: smooth;
`;

/**
 * Input form area
 */
const InputContainer = styled.div`
  border-top: 1px solid #e1e1e1;
  padding: 12px;
  display: flex;
  background-color: #f7f7f7;
`;

/**
 * Textarea for message input
 */
const MessageInput = styled.textarea`
  flex-grow: 1;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px 14px;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  min-height: 20px;
  max-height: 120px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #10a37f;
  }
`;

/**
 * Send button with different states (disabled, loading)
 */
const SendButton = styled.button<{ isDisabled: boolean }>`
  background-color: #10a37f;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0 16px;
  margin-left: 8px;
  font-weight: 600;
  cursor: ${({ isDisabled }) => (isDisabled ? "not-allowed" : "pointer")};
  opacity: ${({ isDisabled }) => (isDisabled ? "0.6" : "1")};
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background-color: #0d8c6d;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

/**
 * Loading indicator animation
 */
const loadingAnimation = css`
  @keyframes pulse {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
  }
`;

/**
 * Loading indicator component
 */
const LoadingIndicator = styled.div`
  ${loadingAnimation}
  display: flex;
  align-items: center;
  padding: 12px 18px;
  border-radius: 8px;
  margin: 8px 0;
  align-self: flex-start;
  font-style: italic;
  color: #666;
  animation: pulse 1.5s infinite;

  &::after {
    content: "...";
    font-weight: bold;
  }
`;

/**
 * API Key form container
 */
const ApiKeyFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  height: 100%;
`;

/**
 * Form title
 */
const FormTitle = styled.h2`
  margin-bottom: 16px;
  color: #333;
`;

/**
 * Input field for API key
 */
const ApiKeyInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 16px;

  &:focus {
    border-color: #10a37f;
    outline: none;
  }
`;

/**
 * Submit button for API key form
 */
const SubmitButton = styled.button`
  background-color: #10a37f;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0d8c6d;
  }
`;

/**
 * Form description text
 */
const FormDescription = styled.p`
  color: #666;
  max-width: 400px;
  text-align: center;
  margin-bottom: 24px;
`;

/**
 * Main ChatUI component that provides a ChatGPT-like interface.
 * Features include:
 * - Message history display with markdown support
 * - Customizable dimensions with props
 * - Message input with multiline support
 * - OpenAI API integration with streaming responses
 * - API key configuration form
 *
 * @param props - Component properties
 * @returns React component
 */
export const ChatUI = React.memo(
	({
		height,
		width,
		apiKey,
		openAIConfig,
		initialMessages = [],
		inputPlaceholder = "Type a message...",
		onMessagesChange,
		isLoading: externalIsLoading,
		onSendMessage,
		onApiKeyChange,
	}: ChatUIProps) => {
		// State for managing messages and UI state
		const [messages, setMessages] = useState<Message[]>(initialMessages);
		const [input, setInput] = useState("");
		const [isLoading, setIsLoading] = useState(false);
		const [openAIService, setOpenAIService] = useState<OpenAIService | null>(
			null,
		);
		const [apiKeyInput, setApiKeyInput] = useState("");

		// References for DOM elements
		const messagesEndRef = useRef<HTMLDivElement>(null);
		const inputRef = useRef<HTMLTextAreaElement>(null);

		// Initialize OpenAI service if API key provided
		useEffect(() => {
			if (apiKey && openAIConfig) {
				setOpenAIService(new OpenAIService(apiKey, openAIConfig));
			} else {
				setOpenAIService(null);
			}
		}, [apiKey, openAIConfig]);

		// Scroll to bottom when messages change
		useEffect(() => {
			if (messagesEndRef.current) {
				messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
			}
		}, [messages]);

		// Notify parent component of message changes
		useEffect(() => {
			if (onMessagesChange) {
				onMessagesChange(messages);
			}
		}, [messages, onMessagesChange]);

		/**
		 * Handles the submission of a new message.
		 * Adds the user message to the chat and triggers OpenAI request if available.
		 */
		const handleSendMessage = useCallback(async () => {
			if (!input.trim() || isLoading || externalIsLoading) return;

			const userMessage: Message = {
				role: "user",
				content: input.trim(),
				timestamp: new Date(),
			};

			// Add user message to the chat
			setMessages((prev) => [...prev, userMessage]);
			setInput("");

			// Focus back on the input after sending
			if (inputRef.current) {
				inputRef.current.focus();
			}

			// If external handler is provided, let the parent component handle the API call
			if (onSendMessage) {
				onSendMessage(userMessage.content);
				return;
			}

			// If OpenAI service is available, make the API call
			if (openAIService) {
				try {
					setIsLoading(true);

					// Create a placeholder for the assistant response
					const assistantMessage: Message = {
						role: "assistant",
						content: "",
						timestamp: new Date(),
					};

					setMessages((prev) => [...prev, assistantMessage]);

					// Stream the response and update the message content
					await openAIService.streamChatCompletion(
						[...messages, userMessage],
						(chunk) => {
							setMessages((prev) => {
								const updated = [...prev];
								const lastMessage = updated[updated.length - 1];
								updated[updated.length - 1] = {
									...lastMessage,
									content: lastMessage.content + chunk,
								};
								return updated;
							});
						},
					);
				} catch (error) {
					console.error("Error calling OpenAI:", error);
					// Add an error message
					setMessages((prev) => [
						...prev,
						{
							role: "assistant",
							content:
								"Sorry, I encountered an error while generating a response. Please try again.",
							timestamp: new Date(),
						},
					]);
				} finally {
					setIsLoading(false);
				}
			}
		}, [
			input,
			isLoading,
			externalIsLoading,
			messages,
			onSendMessage,
			openAIService,
		]);

		/**
		 * Handles the submission of API key
		 */
		const handleApiKeySubmit = useCallback(() => {
			if (apiKeyInput.trim() && onApiKeyChange) {
				onApiKeyChange(apiKeyInput.trim());
			}
		}, [apiKeyInput, onApiKeyChange]);

		/**
		 * Handles keyboard events in the textarea.
		 * Submits on Ctrl+Enter or Cmd+Enter.
		 */
		const handleKeyDown = useCallback(
			(e: React.KeyboardEvent) => {
				if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
					e.preventDefault();
					handleSendMessage();
				}
			},
			[handleSendMessage],
		);

		/**
		 * Handle API key input keydown for Enter key
		 */
		const handleApiKeyInputKeyDown = useCallback(
			(e: React.KeyboardEvent) => {
				if (e.key === "Enter") {
					e.preventDefault();
					handleApiKeySubmit();
				}
			},
			[handleApiKeySubmit],
		);

		/**
		 * Adjust textarea height based on content
		 */
		const adjustTextareaHeight = useCallback(() => {
			if (inputRef.current) {
				inputRef.current.style.height = "auto";
				inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
			}
		}, []);

		/**
		 * Handle input changes and resize textarea
		 */
		const handleInputChange = useCallback(
			(e: React.ChangeEvent<HTMLTextAreaElement>) => {
				setInput(e.target.value);
				adjustTextareaHeight();
			},
			[adjustTextareaHeight],
		);

		// Render API key form if API key is not provided
		if (!apiKey) {
			return (
				<ChatContainer width={width} height={height}>
					<ChatHeader>
						<AssistantAvatar>AI</AssistantAvatar>
						<HeaderTitle>AI Assistant</HeaderTitle>
					</ChatHeader>

					<ApiKeyFormContainer>
						<FormTitle>OpenAI API設定</FormTitle>
						<FormDescription>
							チャット機能を使用するには、OpenAI
							APIキーを入力してください。APIキーはブラウザのローカルストレージに保存され、サーバーには送信されません。
						</FormDescription>
						<ApiKeyInput
							type="password"
							placeholder="OpenAI APIキーを入力"
							value={apiKeyInput}
							onChange={(e) => setApiKeyInput(e.target.value)}
							onKeyDown={handleApiKeyInputKeyDown}
						/>
						<SubmitButton onClick={handleApiKeySubmit}>
							保存して続行
						</SubmitButton>
					</ApiKeyFormContainer>
				</ChatContainer>
			);
		}

		return (
			<ChatContainer width={width} height={height}>
				<ChatHeader>
					<AssistantAvatar>AI</AssistantAvatar>
					<HeaderTitle>AI Assistant</HeaderTitle>
				</ChatHeader>

				<MessagesContainer>
					{messages.map((message, index) => (
						<MessageItem key={index} message={message} />
					))}

					{(isLoading || externalIsLoading) && (
						<LoadingIndicator>AI is thinking</LoadingIndicator>
					)}

					{/* Empty div for scrolling to bottom */}
					<div ref={messagesEndRef} />
				</MessagesContainer>

				<InputContainer>
					<MessageInput
						ref={inputRef}
						value={input}
						onChange={handleInputChange}
						onKeyDown={handleKeyDown}
						placeholder={inputPlaceholder}
						rows={1}
						disabled={isLoading || externalIsLoading}
					/>
					<SendButton
						onClick={handleSendMessage}
						isDisabled={!input.trim() || isLoading || !!externalIsLoading}
						disabled={!input.trim() || isLoading || !!externalIsLoading}
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>Send Icon</title>
							<path
								d="M22 2L11 13"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M22 2L15 22L11 13L2 9L22 2Z"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</SendButton>
				</InputContainer>
			</ChatContainer>
		);
	},
);
