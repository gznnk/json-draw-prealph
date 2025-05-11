import type { DiagramType } from "../base";

/**
 * Event fired when a diagram is dragged and dropped onto another element
 */
export type DiagramDragDropEvent = {
	eventId: string;
	dropItem: {
		id: string;
		type?: DiagramType;
		x: number;
		y: number;
	};
	dropTargetItem: {
		id: string;
		type?: DiagramType;
		x: number;
		y: number;
	};
};
