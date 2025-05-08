// Import libraries.
import { OpenAI } from "openai";

// Import utilities.
import { OpenAiKeyManager } from "../../../../utils/KeyManager";

// Import ai tools.
import type { aiToolHander } from "../../../../ai-tools";
import { addImageGenNode } from "../add_image_gen_node";
import { addLLMNode } from "../add_llm_node";
import { addSvgToCanvasNode } from "../add_svg_to_canvas_node";
import { addTextNode } from "../add_text_node";
import { connectNodes } from "../connect_nodes";

export const AI_AGENT_INSTRUCTIONS = `
You are an AI agent responsible for building workflows by calling available functions.  
Use the provided tools to create workflows based strictly on user input.  
Only create the minimum necessary workflow to achieve the user's request.  
Always choose functions carefully and avoid unnecessary or redundant calls.  
Do not invent new functions or tools; only use those that are provided.  

When placing nodes on the canvas, arrange them horizontally from left to right by setting appropriate X and Y coordinates.  
When placing the first node, position it near the center of the currently visible area of the canvas.  
When arranging nodes horizontally, maintain a fixed horizontal spacing of 100 pixels between the right edge of a node and the left edge of the next node.  
If a node has multiple outgoing connections (branching), you must offset the target nodes downward (in the positive Y direction) to prevent overlap and ensure a clear layout.  
When multiple target nodes are created from a single branching point, maintain a fixed horizontal spacing of 100 pixels between each of the target nodes.  
Always connect all nodes appropriately according to the workflow structure.  
Do not leave any created nodes unconnected unless explicitly instructed otherwise.

When generating natural language responses, always use the same language as the user's input.
`;

export const AI_TOOLS = [
	addImageGenNode.definition,
	addLLMNode.definition,
	addTextNode.definition,
	addSvgToCanvasNode.definition,
	connectNodes.definition,
] as const satisfies OpenAI.Responses.Tool[];

export const AI_TOOL_HANDLERS = {
	add_image_gen_node: addImageGenNode.handler,
	add_llm_node: addLLMNode.handler,
	add_text_node: addTextNode.handler,
	add_svg_to_canvas_node: addSvgToCanvasNode.handler,
	connect_nodes: connectNodes.handler,
} as const satisfies Record<string, aiToolHander>;

// biome-ignore lint/suspicious/noExplicitAny: argument type is not known
export const handler = async (args: any) => {
	if ("user_goal" in args) {
		const storedApiKey = OpenAiKeyManager.loadKey();

		if (!storedApiKey) return { success: false, content: "API key not found." };

		const openai = new OpenAI({
			apiKey: storedApiKey,
			dangerouslyAllowBrowser: true, // ブラウザで直接使用する場合に必要
		});

		// Initialize the input for the OpenAI API.
		const input = [
			{
				role: "system",
				content: AI_AGENT_INSTRUCTIONS,
			},
		] as OpenAI.Responses.ResponseInput;

		input.push({
			role: "user",
			content: args.user_goal,
		});

		try {
			let count = 0;
			// TODO: 回数の精査
			while (count < 10) {
				let foundFunctionCall = false;
				const stream = await openai.responses.create({
					model: "gpt-4o",
					instructions: AI_AGENT_INSTRUCTIONS,
					input: input,
					stream: true,
					tools: AI_TOOLS,
				});

				let outputText = "";
				for await (const chunk of stream) {
					console.log(chunk);

					if (chunk.type === "response.output_text.done") {
						outputText = chunk.text;
					}

					if (
						chunk.type === "response.output_item.done" &&
						chunk.item?.type === "function_call"
					) {
						const functionName = chunk.item.name;
						const functionCallArguments = JSON.parse(chunk.item.arguments);
						const result = AI_TOOL_HANDLERS[
							functionName as keyof typeof AI_TOOL_HANDLERS
						]?.(functionCallArguments);
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

				count++;

				if (!foundFunctionCall) {
					return {
						success: true,
						content: outputText,
					};
				}

				console.log("Function call found, continuing to next iteration.");
			}
		} catch (error) {
			console.error("Error streaming chat completion:", error);
			return {
				success: false,
				content: "Error streaming chat completion.",
			};
		}

		// Return the created node data.
		return {
			success: true,
			content: "Workflow generation completed.",
		};
	}
};
