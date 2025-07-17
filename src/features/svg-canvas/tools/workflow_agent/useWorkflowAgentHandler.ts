import { useMemo } from "react";
import { LLMClientFactory } from "../../../../shared/llm-client";
import type {
	FunctionCallHandler,
	FunctionCallInfo,
} from "../../../../shared/llm-client/types";
import { OpenAiKeyManager } from "../../../../utils/KeyManager";
import { addImageGenNode } from "../add_image_gen_node";
import { addLLMNode } from "../add_llm_node";
import { addSvgToCanvasNode } from "../add_svg_to_canvas_node";
import { addTextNode } from "../add_text_node";
import { connectNodes } from "../connect_nodes";
import AI_AGENT_INSTRUCTIONS from "./prompts/agent-instructions.md?raw";

/**
 * Workflow agent handler function (hook版)
 * 必要な依存を受け取り、FunctionCallHandlerを返す
 */
export const useWorkflowAgentHandler = (): FunctionCallHandler => {
	// handler本体はuseMemoで生成
	return useMemo<FunctionCallHandler>(() => {
		const AI_TOOLS = [
			addImageGenNode.definition,
			addLLMNode.definition,
			addTextNode.definition,
			addSvgToCanvasNode.definition,
			connectNodes.definition,
		];
		const functionHandlerMap = {
			add_image_gen_node: addImageGenNode.handler,
			add_llm_node: addLLMNode.handler,
			add_text_node: addTextNode.handler,
			add_svg_to_canvas_node: addSvgToCanvasNode.handler,
			// connect_nodes: connectNodes.handler,
		};
		const handler: FunctionCallHandler = async (
			functionCall: FunctionCallInfo,
		) => {
			const args = functionCall.arguments as { user_goal: string };
			if (typeof args.user_goal === "string") {
				const storedApiKey = OpenAiKeyManager.loadKey();
				if (!storedApiKey)
					return { success: false, content: "API key not found." };
				let outputContent = "";
				try {
					const llmClient = LLMClientFactory.createClient(storedApiKey, {
						tools: AI_TOOLS,
						systemPrompt: AI_AGENT_INSTRUCTIONS,
						functionHandlers: functionHandlerMap,
					});
					const userMessage = `${args.user_goal}\n\nStart placing the first node near (X: ${300}, Y: ${200}) on the canvas.`;
					await llmClient.chat({
						message: userMessage,
						onTextChunk: (textChunk) => {
							outputContent += textChunk;
						},
					});
					return {
						success: true,
						content: outputContent || "Workflow generation completed.",
					};
				} catch (error) {
					// eslint-disable-next-line no-console
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
		return handler;
	}, []);
};
