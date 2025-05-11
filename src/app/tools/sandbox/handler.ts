/**
 * Handler function for the create_sandbox tool.
 * Creates a new sandbox sheet and injects the provided HTML content.
 */

import { newId } from "../../../features/svg-canvas/utils";
import { dispatchAddNewSheetEvent } from "../../App";
import { dispatchUpdateSandboxContentEvent } from "../../components/SandboxSheet";

/**
 * Handles the creation of a new sandbox with custom HTML content.
 *
 * @param args - The arguments for the function, including sandbox_name and html_content
 * @returns - An object containing the ID and name of the created sandbox
 */
// biome-ignore lint/suspicious/noExplicitAny: argument type is not known
export const handler = (args: any) => {
	// Check if required arguments are present
	if ("sandbox_name" in args && "html_content" in args) {
		// Generate a unique ID for the new sandbox
		const id = newId();
		// Create a new sheet for the sandbox
		dispatchAddNewSheetEvent({
			id,
			sheetName: args.sandbox_name,
			sheetType: "sandbox", // Explicitly set the sheet type to sandbox
		});

		// A small delay to ensure the sheet is created before updating content
		setTimeout(() => {
			// Update the sandbox content with the provided HTML
			dispatchUpdateSandboxContentEvent({
				id,
				htmlContent: args.html_content,
			});
		}, 100);
		// Return information about the created sandbox
		return {
			id,
			sandbox_name: args.sandbox_name,
			status: "Sandbox created successfully",
		};
	}

	// Return an error if required arguments are missing
	return {
		error:
			"Missing required arguments: sandbox_name and html_content are required",
	};
};
