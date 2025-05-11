/**
 * Exports the create_sandbox tool definition and handler.
 * This tool enables creating interactive HTML sandboxes in the application.
 */

import { definition } from "./definition";
import { handler } from "./handler";

/**
 * The complete sandbox tool with definition and handler.
 */
export const createSandbox = {
	definition: definition,
	handler: handler,
};
