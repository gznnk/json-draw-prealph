import type { EventType } from "./EventType";
import type { Shape } from "../base";

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
