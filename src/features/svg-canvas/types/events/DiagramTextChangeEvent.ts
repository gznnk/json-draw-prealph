import type { EventType } from "./EventType";

/**
 * Event fired when text content is changed on a diagram
 */
export type DiagramTextChangeEvent = {
	eventId: string;
	eventType: EventType;
	id: string;
	text: string;
};
