import type { Diagram } from "../DiagramCatalog";

/**
 * Event for creating a new diagram item with complete details
 */
export type NewItemEvent = {
	eventId: string;
	item: Diagram;
};
