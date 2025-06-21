import type { EventType } from "./EventType";

/**
 * Event fired during area selection operations
 */
export type AreaSelectionEvent = {
	eventId: string;
	eventType: EventType;
	clientX: number;
	clientY: number;
};
