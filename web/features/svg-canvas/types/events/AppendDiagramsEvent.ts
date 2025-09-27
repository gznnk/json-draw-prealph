import type { Diagram } from "../state/core/Diagram";

/**
 * Event for appending multiple diagrams to a CanvasFrame via drag and drop.
 * Contains the target frame ID and the diagrams to be appended.
 */
export type AppendDiagramsEvent = {
	eventId: string;
	targetFrameId: string;
	diagrams: Diagram[];
};