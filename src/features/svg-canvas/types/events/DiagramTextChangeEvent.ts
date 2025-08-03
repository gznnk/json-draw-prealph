import type { EventPhase } from "./EventPhase";

/**
 * Event fired when text content is changed on a diagram
 */
export type DiagramTextChangeEvent = {
	eventId: string;
	eventPhase: EventPhase;
	id: string;
	text: string;
};
