import type { PathData } from "../data/shapes/PathData";

/**
 * Event that represents a preview connection line state change.
 * This event is triggered when the preview connection line should be shown, updated, or hidden.
 */
export type PreviewConnectLineEvent = {
	/**
	 * The path data for the preview connection line.
	 * When undefined, the preview line should be hidden.
	 */
	pathData?: PathData;
};
