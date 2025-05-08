// Import libraries.
import type { OpenAI } from "openai";

// Import shared descriptions.
import {
	X_PARAM_DESCRIPTION,
	Y_PARAM_DESCRIPTION,
} from "../shared/descriptions";

const TOOL_DESCRIPTION = `
Adds an SVG Diagram node to the canvas.  
The node receives input from connected LLM or text nodes.  
It converts text descriptions into SVG diagrams using a diagram generation model and displays the generated diagram on the canvas.  
The SVG Diagram node does not send any output to other nodes.  
Returns a JSON object containing the node ID, node type and the size (width and height).
`;

export const definition = {
	type: "function",
	name: "add_svg_to_canvas_node",
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
