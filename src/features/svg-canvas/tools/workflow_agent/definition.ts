// Import libraries.
import type { OpenAI } from "openai";

// Import prompt.
import TOOL_DESCRIPTION from "./prompts/tool-description.md?raw";

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
