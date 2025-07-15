import type { Diagram } from "../data/catalog/Diagram";

/**
 * Event for adding a new diagram to the canvas.
 */
export type AddDiagramEvent = {
	eventId: string;
	item: Diagram;
};
