// Import libraries.
import type { OpenAI } from "openai";

/**
 * Description for the sandbox tool that creates an interactive HTML sandbox.
 * Instructs LLMs on how to use this tool appropriately.
 */
const TOOL_DESCRIPTION = `
Use this tool to create interactive HTML applications like calculators, games, demos, or any content that requires HTML/CSS/JavaScript.
This tool is the preferred method for creating ANY interactive web content, rather than using workflow diagrams.

USE CASES (Always use this tool for):
- Interactive applications (calculators, converters, games)
- Demonstrations of HTML/CSS/JavaScript concepts
- Visual demos with user interaction
- Form-based applications
- Any app that requires client-side logic

IMPORTANT USAGE NOTES:
- The HTML must be provided as a complete, valid document with proper DOCTYPE, html, head, and body tags
- All CSS should be included within <style> tags in the head section
- All JavaScript should be included within <script> tags
- External resources are not allowed due to sandbox restrictions
- The content will be displayed exactly as provided, so ensure it's properly formatted

EXAMPLE: When asked to "create a calculator", use this tool instead of workflow_agent
`;

/**
 * Tool definition for creating sandbox environments with custom HTML content.
 */
export const definition = {
	type: "function",
	name: "create_sandbox",
	description: TOOL_DESCRIPTION,
	parameters: {
		type: "object",
		properties: {
			sandbox_name: {
				type: "string",
				description: "A descriptive name for the sandbox sheet.",
			},
			html_content: {
				type: "string",
				description:
					"Complete HTML document to display in the sandbox (including DOCTYPE, html, head, body tags).",
			},
			description: {
				type: "string",
				description:
					"Optional description of what this sandbox demonstrates or is used for.",
			},
		},
		additionalProperties: false,
		required: ["sandbox_name", "html_content"],
	},
	strict: true,
} as const satisfies OpenAI.Responses.Tool;
