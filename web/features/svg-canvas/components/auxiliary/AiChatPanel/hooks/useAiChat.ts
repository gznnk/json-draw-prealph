import { useCallback, useEffect, useState } from "react";

import {
	LLMClientFactory,
	type LLMClient,
} from "../../../../../../shared/llm-client";
import { OpenAiKeyManager } from "../../../../../../utils/KeyManager";
import type { Message } from "../../../../../llm-chat-ui/types";

/**
 * Custom hook for managing AI chat functionality using llm-client.
 * Handles LLM client initialization, message management, and streaming responses.
 *
 * @returns Object containing chat state and handlers
 */
export const useAiChat = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [apiKey, setApiKey] = useState<string>("");
	const [llmClient, setLlmClient] = useState<LLMClient | null>(null);

	// Load API key on mount
	useEffect(() => {
		const storedApiKey = OpenAiKeyManager.loadKey();
		if (storedApiKey) {
			setApiKey(storedApiKey);
		}
	}, []);

	// Initialize LLM client when API key is available
	useEffect(() => {
		if (apiKey) {
			const client = LLMClientFactory.createClient(apiKey, {
				systemPrompt:
					"You are a helpful AI assistant. Provide clear, concise, and friendly responses.",
			});
			setLlmClient(client);
		}
	}, [apiKey]);

	/**
	 * Send a message to the AI and handle streaming response
	 */
	const sendMessage = useCallback(
		async (messageContent: string) => {
			if (!messageContent.trim() || !llmClient || isLoading) {
				return;
			}

			// Add user message
			const userMessage: Message = {
				content: messageContent,
				role: "user",
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, userMessage]);

			// Start loading
			setIsLoading(true);

			try {
				let fullResponse = "";

				// Create assistant message placeholder
				const assistantMessage: Message = {
					content: "",
					role: "assistant",
					timestamp: new Date(),
				};
				setMessages((prev) => [...prev, assistantMessage]);

				// Use LLM client's chat method with streaming
				await llmClient.chat({
					message: messageContent,
					onTextChunk: (textChunk: string) => {
						fullResponse += textChunk;

						// Update the last message (assistant's response) with accumulated text
						setMessages((prev) => {
							const newMessages = [...prev];
							if (newMessages.length > 0) {
								const lastMessage = newMessages[newMessages.length - 1];
								if (lastMessage.role === "assistant") {
									lastMessage.content = fullResponse;
								}
							}
							return newMessages;
						});
					},
				});
			} catch (error) {
				console.error("Error sending message to AI:", error);

				// Add error message
				const errorMessage: Message = {
					content: `Error: ${error instanceof Error ? error.message : "Failed to get response from AI"}`,
					role: "assistant",
					timestamp: new Date(),
				};
				setMessages((prev) => [...prev, errorMessage]);
			} finally {
				setIsLoading(false);
			}
		},
		[llmClient, isLoading],
	);

	/**
	 * Clear all messages
	 */
	const clearMessages = useCallback(() => {
		setMessages([]);
		llmClient?.clearConversation();
	}, [llmClient]);

	return {
		messages,
		isLoading,
		hasApiKey: !!apiKey,
		sendMessage,
		clearMessages,
	};
};
