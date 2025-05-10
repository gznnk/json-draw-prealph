// Import libraries.
import type { OpenAI } from "openai";

// Import shared descriptions.
import {
	X_PARAM_DESCRIPTION,
	Y_PARAM_DESCRIPTION,
} from "../shared/descriptions";

const TOOL_DESCRIPTION = `
Adds an LLM (Large Language Model) node to the canvas.  
The node can receive input from connected text nodes or other nodes.  
It processes the text with a language model according to the provided instructions and sends the output to connected nodes.  
The LLM node can be configured with specific instructions to control its behavior.  
Returns a JSON object containing the node ID, node type and the size (width and height).
`;

export const definition = {
	type: "function",
	name: "add_llm_node",
	description: TOOL_DESCRIPTION,
	parameters: {
		type: "object",
		properties: {
			x: {
				type: "number",
				description: X_PARAM_DESCRIPTION,
			},
			y: {
				type: "number",
				description: Y_PARAM_DESCRIPTION,
			},
			instructions: {
				type: "string",
				description:
					"The instructions to guide the LLM node's processing behavior.",
			},
		},
		additionalProperties: false,
		required: ["x", "y", "instructions"],
	},
	strict: true,
} as const satisfies OpenAI.Responses.Tool;
