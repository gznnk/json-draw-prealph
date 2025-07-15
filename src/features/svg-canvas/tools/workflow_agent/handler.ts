// Import libraries.
import { LLMClientFactory } from "../../../../shared/llm-client";
import type { FunctionHandlerMap } from "../../../../shared/llm-client/types";

// Import utilities.
import { OpenAiKeyManager } from "../../../../utils/KeyManager";

// Import ai tools.
import { addImageGenNode } from "../add_image_gen_node";
import { addLLMNode } from "../add_llm_node";
import { addSvgToCanvasNode } from "../add_svg_to_canvas_node";
import { addTextNode } from "../add_text_node";
import { connectNodes } from "../connect_nodes";

// Import prompt.
import AI_AGENT_INSTRUCTIONS from "./prompts/agent-instructions.md?raw";

/**
 * List of tool definitions available in the workflow agent
 */
export const AI_TOOLS = [
	addImageGenNode.definition,
	addLLMNode.definition,
	addTextNode.definition,
	addSvgToCanvasNode.definition,
	connectNodes.definition,
];

/**
 * FunctionHandlerMap for llm-client
 * Directly utilizes each tool's handler
 */
const functionHandlerMap: FunctionHandlerMap = {
	add_image_gen_node: addImageGenNode.handler,
	add_llm_node: addLLMNode.handler,
	add_text_node: addTextNode.handler,
	add_svg_to_canvas_node: addSvgToCanvasNode.handler,
	// connect_nodes: connectNodes.handler,
};

// Import FunctionCallHandler type
import type {
	FunctionCallHandler,
	FunctionCallInfo,
} from "../../../../shared/llm-client/types";

/**
 * Workflow agent handler function
 * Automatically generates workflows based on user goals
 *
 * @param functionCall - Function call information (including user_goal)
 * @returns Result object containing success/failure status and content, or null
 */
export const handler: FunctionCallHandler = async (
	functionCall: FunctionCallInfo,
) => {
	const args = functionCall.arguments as { user_goal: string };

	if (typeof args.user_goal === "string") {
		// Get API key
		const storedApiKey = OpenAiKeyManager.loadKey();
		if (!storedApiKey) return { success: false, content: "API key not found." };

		// Variable for output text
		let outputContent = "";

		try {
			// Create client using LLMClientFactory
			const llmClient = LLMClientFactory.createClient(storedApiKey, {
				tools: AI_TOOLS,
				systemPrompt: AI_AGENT_INSTRUCTIONS,
				functionHandlers: functionHandlerMap,
			});

			// Send user goal and canvas placement instructions as message
			const userMessage = `${args.user_goal}\n\nStart placing the first node near (X: ${300}, Y: ${200}) on the canvas.`;

			// Execute chat and process response
			await llmClient.chat({
				message: userMessage,
				onTextChunk: (textChunk) => {
					// Accumulate text chunks
					outputContent += textChunk;
				},
			});

			// Return success response
			return {
				success: true,
				content: outputContent || "Workflow generation completed.",
			};
		} catch (error) {
			console.error("Error in workflow agent:", error);
			return {
				success: false,
				content: "Error generating workflow.",
			};
		}
	}

	return {
		success: false,
		content: "Invalid arguments: user_goal is required.",
	};
};
