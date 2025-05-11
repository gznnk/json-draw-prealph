import OpenAI from "openai";
import type { Message } from "../types";

// TODO: 直接インポートするのではなく、Propsで渡すようにする
import { workflowAgent } from "../../svg-canvas/tools/workflow_agent";
import { newSheet } from "../../../app/tools/new_sheet";
import { createSandbox } from "../../../app/tools/sandbox";

/**
 * Service for handling communication with OpenAI's API.
 * Manages API requests and response processing.
 */
export class OpenAIService {
	private client: OpenAI | null = null;

	/**
	 * Creates a new OpenAI service instance.
	 *
	 * @param apiKey - The OpenAI API key for authentication
	 * @param config - Configuration options for API requests
	 */
	constructor(apiKey: string) {
		this.client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
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

		const input = messages.map((msg) => ({
			role: msg.role,
			content: msg.content,
		})) as OpenAI.Responses.ResponseInput;

		try {
			let count = 0;
			while (count < 10) {
				let foundFunctionCall = false;
				const stream = await this.client.responses.create({
					model: "gpt-4o",
					instructions:
						"You are a general-purpose assistant that outputs responses in Markdown format. When including LaTeX expressions, do not use code blocks (e.g., triple backticks or indentation). Instead, use inline LaTeX syntax like $...$ for inline math and $$...$$ for block math. When creating workflows, always create a new sheet first before creating the workflow itself. For HTML content or interactive applications (like calculators, games, demos), use the create_sandbox tool instead of workflow_agent. The create_sandbox tool lets you generate a complete HTML document with proper DOCTYPE, html, head, and body tags, including CSS and JavaScript all in one file. When user mentions 'アプリ', 'ゲーム', 'デモ', 'HTML', 'インタラクティブ', or any interactive content that would benefit from HTML rendering, prioritize using create_sandbox over workflow_agent.",
					input: input,
					stream: true,
					tools: [
						workflowAgent.definition,
						newSheet.definition,
						createSandbox.definition,
					],
				});

				for await (const chunk of stream) {
					console.log(chunk);

					if (chunk.type === "response.output_text.delta") {
						const delta = chunk.delta;

						if (delta) {
							onChunk(delta);
						}
					}

					if (
						chunk.type === "response.output_item.done" &&
						chunk.item?.type === "function_call"
					) {
						if (chunk.item.name === "workflow_agent") {
							const functionCallArguments = JSON.parse(chunk.item.arguments);
							const result = await workflowAgent.handler(functionCallArguments);
							if (result) {
								foundFunctionCall = true;
								input.push(chunk.item);
								input.push({
									type: "function_call_output",
									call_id: chunk.item.call_id,
									output: JSON.stringify(result),
								});
							}
						}
						if (chunk.item.name === "new_sheet") {
							const functionCallArguments = JSON.parse(chunk.item.arguments);
							const result = newSheet.handler(functionCallArguments);
							if (result) {
								foundFunctionCall = true;
								input.push(chunk.item);
								input.push({
									type: "function_call_output",
									call_id: chunk.item.call_id,
									output: JSON.stringify(result),
								});
							}
						}
						if (chunk.item.name === "create_sandbox") {
							const functionCallArguments = JSON.parse(chunk.item.arguments);
							const result = createSandbox.handler(functionCallArguments);
							if (result) {
								foundFunctionCall = true;
								input.push(chunk.item);
								input.push({
									type: "function_call_output",
									call_id: chunk.item.call_id,
									output: JSON.stringify(result),
								});
							}
						}
					}
				}

				count++;

				if (!foundFunctionCall) {
					break;
				}

				console.log("Function call found, continuing to next iteration.");
			}
		} catch (error) {
			console.error("Error streaming chat completion:", error);
			throw error;
		}
	}
}
