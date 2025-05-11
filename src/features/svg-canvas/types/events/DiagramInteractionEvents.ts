import type { DiagramType, Shape } from "../base";
import type { Diagram } from "../DiagramCatalog";
import type { EventType } from "./EventBaseTypes";

/**
 * Event fired when a pointer is pressed down on a diagram
 */
export type DiagramPointerEvent = {
	eventId: string;
	id: string;
};

/**
 * Event fired during diagram dragging operations
 */
export type DiagramDragEvent = {
	eventId: string;
	eventType: EventType;
	id: string;
	startX: number;
	startY: number;
	endX: number;
	endY: number;
	cursorX?: number;
	cursorY?: number;
};

/**
 * Event fired when a diagram is dragged and dropped onto another element
 */
export type DiagramDragDropEvent = {
	eventId: string;
	dropItem: {
		id: string;
		type?: DiagramType;
		x: number;
		y: number;
	};
	dropTargetItem: {
		id: string;
		type?: DiagramType;
		x: number;
		y: number;
	};
};

/**
 * Event fired when files are dropped onto a diagram
 */
export type FileDropEvent = {
	eventId: string;
	id: string;
	files: FileList;
};

/**
 * Event fired when a diagram is clicked
 */
export type DiagramClickEvent = {
	eventId: string;
	id: string;
};

/**
 * Event fired when hovering over a diagram
 */
export type DiagramHoverEvent = {
	eventId: string;
	id: string;
	isHovered: boolean;
};

/**
 * Event fired when a diagram is selected
 */
export type DiagramSelectEvent = {
	eventId: string;
	id: string;
	isMultiSelect?: boolean;
};

/**
 * Event fired during diagram transformation operations
 */
export type DiagramTransformEvent = {
	eventId: string;
	id: string;
	eventType: EventType;
	startShape: Shape;
	endShape: Shape;
	cursorX?: number;
	cursorY?: number;
};

/**
 * Data structure for diagram change events
 */
export type DiagramChangeData = Partial<Diagram>;

/**
 * The type of diagram change event.
 */
export type DiagramChangeEventType = "Drag" | "Transform" | "Appearance";

/**
 * Event fired when a diagram's properties are changed
 */
export type DiagramChangeEvent = {
	eventId: string;
	eventType: EventType;
	changeType: DiagramChangeEventType;
	id: string;
	startDiagram: DiagramChangeData;
	endDiagram: DiagramChangeData;
	cursorX?: number;
	cursorY?: number;
};

/**
 * Event fired when text editing is initiated on a diagram
 */
export type DiagramTextEditEvent = {
	id: string;
};

/**
 * Event fired when text content is changed on a diagram
 */
export type DiagramTextChangeEvent = {
	eventId: string;
	id: string;
	text: string;
};

/**
 * Types of stack order changes for diagrams
 */
export type StackOrderChangeType =
	| "bringToFront" // Move to the very front
	| "sendToBack" // Move to the very back
	| "bringForward" // Move one step forward
	| "sendBackward"; // Move one step backward

/**
 * Event for changing the z-index (stack order) of a diagram
 */
export type StackOrderChangeEvent = {
	id: string;
	changeType: StackOrderChangeType;
};

/**
 * Event type for new diagram creation.
 */
export type NewDiagramEvent = {
	eventId: string;
	diagramType: DiagramType;
	x?: number;
	y?: number;
	isSelected?: boolean;
};

/**
 * Event for creating a new diagram item with complete details
 */
export type NewItemEvent = {
	eventId: string;
	item: Diagram;
};
