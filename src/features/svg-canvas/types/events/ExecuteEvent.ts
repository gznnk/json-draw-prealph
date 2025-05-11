import type { EventType } from "./EventBaseTypes";
import type { ExecuteResult } from "./ExecuteResult";

/**
 * Event fired when a diagram executes an operation
 */
export type ExecuteEvent = {
	eventId: string;
	eventType: EventType;
	id: string;
	data: ExecuteResult;
};
