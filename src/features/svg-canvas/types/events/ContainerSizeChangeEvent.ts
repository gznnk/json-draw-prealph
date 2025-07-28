/**
 * Event for container size changes.
 */
export type ContainerSizeChangeEvent = {
	eventId: string;
	width: number;
	height: number;
	minX: number;
	minY: number;
};