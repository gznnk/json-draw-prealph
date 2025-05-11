/**
 * Functions related to SandboxSheet component and its events.
 * This module provides actions to manipulate sandbox content.
 */

/**
 * Event name constant for updating sandbox content.
 * Used to maintain consistency across event dispatching and handling.
 */
export const UPDATE_SANDBOX_CONTENT_EVENT_NAME = "update_sandbox_content";

/**
 * Type definition for the update sandbox content event payload.
 */
type UpdateSandboxContentPayload = {
	/**
	 * The ID of the sandbox to update.
	 */
	id: string;

	/**
	 * The new HTML content to set in the sandbox.
	 */
	htmlContent: string;
};

/**
 * Dispatches an event to update the content of a sandbox iframe.
 * This function creates a custom event and dispatches it to the window,
 * allowing different parts of the application to communicate with the sandbox.
 *
 * @param payload - The event payload containing the sandbox ID and new HTML content
 * @param payload.id - ID of the sandbox to update
 * @param payload.htmlContent - New HTML content to set in the sandbox
 */
export const dispatchUpdateSandboxContentEvent = (
	payload: UpdateSandboxContentPayload,
): void => {
	const event = new CustomEvent(UPDATE_SANDBOX_CONTENT_EVENT_NAME, {
		detail: payload,
	});
	window.dispatchEvent(event);
};
