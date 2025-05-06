/**
 * Represents a single message in the chat conversation.
 * Contains the content, role (user or assistant), and timestamp.
 */
export interface Message {
	/** The content of the message */
	content: string;
	/** The role of the message sender (user or assistant) */
	role: "user" | "assistant";
	/** Optional timestamp when the message was created */
	timestamp?: Date;
}

/**
 * Configuration for the OpenAI API request.
 * Includes model selection, temperature, and other parameters.
 */
export interface OpenAIConfig {
	/** The model to use for completion */
	model: string;
	/** Controls randomness: 0 = deterministic, 1 = maximum randomness */
	temperature?: number;
}
