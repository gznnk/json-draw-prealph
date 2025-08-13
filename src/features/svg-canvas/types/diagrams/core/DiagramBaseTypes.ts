// Import types.
import type { DiagramType } from "../../core/DiagramType";
import type { DiagramDragEvent } from "../../events/DiagramDragEvent";
import type { DiagramDragDropEvent } from "../../events/DiagramDragDropEvent";
import type { DiagramClickEvent } from "../../events/DiagramClickEvent";
import type { DiagramHoverChangeEvent } from "../../events/DiagramHoverChangeEvent";

/**
 * Base data structure for all diagram elements.
 * Provides common properties that all diagram types must implement.
 */
export type DiagramBaseData = {
	id: string;
	type: DiagramType;
	x: number;
	y: number;
};

/**
 * Base state structure for all diagram elements.
 * Extends base data with runtime state that should not be persisted.
 */
export type DiagramBaseState = DiagramBaseData & {
	isDragging?: boolean;
};

/**
 * Base properties for diagram components.
 * Defines common event handlers and appearance settings shared by all diagram elements.
 */
export type DiagramBaseProps = {
	isTransparent?: boolean;
	onDrag?: (e: DiagramDragEvent) => void;
	onDrop?: (e: DiagramDragDropEvent) => void;
	onDragOver?: (e: DiagramDragDropEvent) => void;
	onDragLeave?: (e: DiagramDragDropEvent) => void;
	onClick?: (e: DiagramClickEvent) => void;
	onHoverChange?: (e: DiagramHoverChangeEvent) => void;
};
