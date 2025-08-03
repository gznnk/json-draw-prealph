import type { EventPhase } from "./EventPhase";
import type { DiagramChangeData } from "./DiagramChangeData";
import type { DiagramChangeEventType } from "./DiagramChangeEventType";

/**
 * Event fired when a diagram's properties are changed
 */
export type DiagramChangeEvent = {
	eventId: string;
	eventPhase: EventPhase;
	changeType: DiagramChangeEventType;
	id: string;
	startDiagram: DiagramChangeData;
	endDiagram: DiagramChangeData;
	cursorX?: number;
	cursorY?: number;
	clientX?: number;
	clientY?: number;
};
