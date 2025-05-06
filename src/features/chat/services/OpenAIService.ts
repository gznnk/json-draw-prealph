import OpenAI from "openai";
import type { Message, OpenAIConfig } from "../types";

/**
 * Service for handling communication with OpenAI's API.
 * Manages API requests and response processing.
 */
export class OpenAIService {
	private client: OpenAI | null = null;
	private config: OpenAIConfig;

	/**
	 * Creates a new OpenAI service instance.
	 *
	 * @param apiKey - The OpenAI API key for authentication
	 * @param config - Configuration options for API requests
	 */
	constructor(apiKey: string, config: OpenAIConfig) {
		this.client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
		this.config = {
			model: config.model || "gpt-3.5-turbo",
			temperature: config.temperature ?? 0.7,
			maxTokens: config.maxTokens,
		};
	}

	/**
	 * Sends a conversation to OpenAI's API and streams the response.
	 *
	 * @param messages - Array of message objects representing the conversation history
	 * @param onChunk - Callback function that receives text chunks as they arrive
	 * @returns Promise that resolves when the stream completes
	 */
	async streamChatCompletion(
		messages: Message[],
		onChunk: (text: string) => void,
	): Promise<void> {
		if (!this.client) {
			throw new Error("OpenAI client is not initialized");
		}

		try {
			const stream = await this.client.chat.completions.create({
				model: this.config.model,
				temperature: this.config.temperature,
				max_tokens: this.config.maxTokens,
				messages: messages.map((msg) => ({
					role: msg.role,
					content: msg.content,
				})),
				stream: true,
			});

			for await (const chunk of stream) {
				const content = chunk.choices[0]?.delta?.content || "";
				if (content) {
					onChunk(content);
				}
			}
		} catch (error) {
			console.error("Error streaming chat completion:", error);
			throw error;
		}
	}
}
