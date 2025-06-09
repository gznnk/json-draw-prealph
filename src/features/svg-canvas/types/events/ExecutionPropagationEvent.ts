import type { EventType } from "./EventType";
import type { ExecuteResult } from "./ExecuteResult";

/**
 * Event for propagating execution results between connected nodes
 */
export type ExecutionPropagationEvent = {
	eventId: string;
	eventType: EventType;
	id: string;
	targetId: string[];
	data: ExecuteResult;
};
