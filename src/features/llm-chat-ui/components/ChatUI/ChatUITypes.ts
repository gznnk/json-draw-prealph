import type { Message, OpenAIConfig } from "../../types.ts";

/**
 * Props for the ChatUI component.
 * Controls appearance, behavior, and API integration.
 */
export interface ChatUIProps {
	/** Custom height for the chat container (CSS value) */
	height?: string;
	/** Custom width for the chat container (CSS value) */
	width?: string;
	/** Optional API key for OpenAI */
	apiKey?: string;
	/** Configuration for OpenAI API requests */
	openAIConfig?: OpenAIConfig;
	/** Optional callback when messages change */
	onMessagesChange?: (messages: Message[]) => void;
	/** Optional initial messages to populate the chat */
	initialMessages?: Message[];
	/** Callback for when the send button is clicked */
	onSendMessage?: (message: string) => void;
}
