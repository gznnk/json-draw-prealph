import type { EventType } from "./EventBaseTypes";

/**
 * Result data from an execution operation
 */
export type ExecuteResult = {
	text: string;
};

/**
 * Event fired when a diagram executes an operation
 */
export type ExecuteEvent = {
	eventId: string;
	eventType: EventType;
	id: string;
	data: ExecuteResult;
};

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
