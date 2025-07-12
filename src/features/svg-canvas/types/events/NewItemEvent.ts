import type { Diagram } from "../data/catalog/Diagram"; // TODO: referencing modules other than types

/**
 * Event for creating a new diagram item with complete details
 */
export type NewItemEvent = {
	eventId: string;
	item: Diagram;
};
