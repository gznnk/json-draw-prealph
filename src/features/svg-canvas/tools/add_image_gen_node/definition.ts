// Import libraries.
import type { OpenAI } from "openai";

// Import shared descriptions.
import {
	X_PARAM_DESCRIPTION,
	Y_PARAM_DESCRIPTION,
} from "../shared/descriptions";

const ADD_IMAGE_GEN_NODE_DESCRIPTION = `
Adds an ImageGeneration node to the canvas.  
The node receives input from connected LLM or text nodes.  
It uses the "gpt-image-1" model to generate an image based on the received input and outputs the generated image onto the canvas.  
The ImageGeneration node does not send any output to other nodes.
The size of the ImageGeneration node is 100 pixels wide and 100 pixels tall.
Returns a JSON object containing the node ID, node type and the size (width and height).
`;

export const definition = {
	type: "function",
	name: "add_image_gen_node",
	description: ADD_IMAGE_GEN_NODE_DESCRIPTION,
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
