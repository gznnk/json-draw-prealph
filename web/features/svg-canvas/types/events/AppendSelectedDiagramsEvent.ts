/**
 * Event for appending currently selected diagrams to a target via drag and drop.
 * Contains only the target ID - selected diagrams are retrieved from canvas state.
 */
export type AppendSelectedDiagramsEvent = {
	eventId: string;
	targetId: string;
};