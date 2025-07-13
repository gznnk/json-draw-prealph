/**
 * Area selection state type for handling selection rectangle on the canvas.
 */
export type AreaSelectionState = {
	isSelecting: boolean;
	startX: number;
	startY: number;
	endX: number;
	endY: number;
};
