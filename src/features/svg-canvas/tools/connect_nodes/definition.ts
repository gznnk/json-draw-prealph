// Import libraries.
import type { OpenAI } from "openai";

const TOOL_DESCRIPTION = `
Creates a connection between two nodes on the canvas.  
The connection enables data flow from the source node to the target node.  
When connected, the output from the source node will be sent as input to the target node.  
Returns a JSON object containing the IDs of the connected nodes (sourceNodeId and targetNodeId).
`;

export const definition = {
	type: "function",
	name: "connect_nodes",
	description: TOOL_DESCRIPTION,
	parameters: {
		type: "object",
		properties: {
			sourceNodeId: {
				type: "string",
				description:
					"The ID of the source node from which the connection will start.",
			},
			targetNodeId: {
				type: "string",
				description:
					"The ID of the target node to which the connection will end.",
			},
		},
		additionalProperties: false,
		required: ["sourceNodeId", "targetNodeId"],
	},
	strict: true,
} as const satisfies OpenAI.Responses.Tool;
