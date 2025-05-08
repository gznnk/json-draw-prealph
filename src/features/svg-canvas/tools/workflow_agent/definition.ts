// Import libraries.
import type { OpenAI } from "openai";

const TOOL_DESCRIPTION = `
Creates a workflow diagram based on a user's request.  
This agent automatically selects from available internal functions to construct a minimal and valid workflow, placing nodes horizontally with consistent spacing.  
Node placement logic ensures visibility and readability by aligning nodes from left to right, offsetting for branches to avoid overlap.  
The user only needs to specify the desired workflow in natural language; all other decisions (function selection, node layout) are handled internally.  
Returns whether the workflow was successfully generated.
`;

export const definition = {
	type: "function",
	name: "workflow_agent",
	description: TOOL_DESCRIPTION,
	parameters: {
		type: "object",
		properties: {
			user_goal: {
				type: "string",
				description:
					"A natural language description of the user's intended workflow (e.g., 'Summarize an uploaded PDF and send it via email.')",
			},
		},
		required: ["user_goal"],
		additionalProperties: false,
	},
	strict: true,
} as const satisfies OpenAI.Responses.Tool;
