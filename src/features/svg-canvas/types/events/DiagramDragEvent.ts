import type { EventType } from "./EventBaseTypes";

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
