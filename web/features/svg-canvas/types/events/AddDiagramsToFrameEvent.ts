import type { Diagram } from "../state/core/Diagram";

/**
 * Event for adding multiple diagrams to a CanvasFrame via drag and drop.
 * Contains the target frame ID and the diagrams to be added.
 */
export type AddDiagramsToFrameEvent = {
	eventId: string;
	targetFrameId: string;
	diagrams: Diagram[];
};