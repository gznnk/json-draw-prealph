// Import libraries.
import type { OpenAI } from "openai";

const TOOL_DESCRIPTION = `
Creates a new sheet in the current workspace.  
When invoked, the tool generates a concise and meaningful name for the sheet based on user input.  
This helps keep sheets organized and easily identifiable.  
Returns a confirmation with the created sheet's name.
`;

export const definition = {
	type: "function",
	name: "new_sheet",
	description: TOOL_DESCRIPTION,
	parameters: {
		type: "object",
		properties: {
			sheet_name: {
				type: "string",
				description:
					"A brief input or prompt from the user, used to automatically generate an appropriate sheet name.",
			},
		},
		additionalProperties: false,
		required: ["sheet_name"],
	},
	strict: true,
} as const satisfies OpenAI.Responses.Tool;
