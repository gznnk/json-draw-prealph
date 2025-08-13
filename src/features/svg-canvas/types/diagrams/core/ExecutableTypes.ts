// Import types.
import type { ExecuteEvent } from "../../events/ExecuteEvent";

/**
 * Interface for diagram elements that can be executed.
 * Note: Executable functionality is primarily runtime behavior, so no data type is needed.
 */

/**
 * Props for executable component.
 */
export type ExecutableProps = {
	onExecute?: (e: ExecuteEvent) => void;
};
