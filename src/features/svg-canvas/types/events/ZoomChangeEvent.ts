/**
 * Event for zoom level changes.
 */
export type ZoomChangeEvent = {
	eventId: string;
	zoom: number;
	minX: number;
	minY: number;
};