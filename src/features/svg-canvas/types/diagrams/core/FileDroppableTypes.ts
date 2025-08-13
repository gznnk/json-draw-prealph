// Import types.
import type { FileDropEvent } from "../../events/FileDropEvent";

/**
 * Interface for diagram elements that can accept file drops.
 * Note: File droppable functionality is primarily runtime behavior, so no data type is needed.
 */

/**
 * Props for file droppable component.
 */
export type FileDroppableProps = {
	onFileDrop?: (e: FileDropEvent) => void;
};
