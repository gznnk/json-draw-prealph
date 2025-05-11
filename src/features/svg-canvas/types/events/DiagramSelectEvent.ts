/**
 * Event fired when a diagram is selected
 */
export type DiagramSelectEvent = {
	eventId: string;
	id: string;
	isMultiSelect?: boolean;
};
