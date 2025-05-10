// Import libraries.
import type { OpenAI } from "openai";

// Import shared descriptions.
import {
	X_PARAM_DESCRIPTION,
	Y_PARAM_DESCRIPTION,
} from "../shared/descriptions";

const TOOL_DESCRIPTION = `
Adds a Text node to the canvas.  
The Text node can be used for entering and displaying text content.  
It can send text input to connected nodes and receive output from other nodes.  
The Text node is editable by the user and can be used for both input and output purposes.  
Returns a JSON object containing the node ID, node type and the size (width and height).
`;

export const definition = {
	type: "function",
	name: "add_text_node",
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
		},
		additionalProperties: false,
		required: ["x", "y"],
	},
	strict: true,
} as const satisfies OpenAI.Responses.Tool;
