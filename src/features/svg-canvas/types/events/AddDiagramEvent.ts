// Import types.
import type { Diagram } from "../diagrams/catalog/DiagramTypes";

/**
 * Event for adding a new diagram to the canvas.
 */
export type AddDiagramEvent = {
	eventId: string;
	item: Diagram;
};
