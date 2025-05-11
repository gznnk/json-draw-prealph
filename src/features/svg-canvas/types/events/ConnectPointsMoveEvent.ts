import type { EventType } from "./EventBaseTypes.js";
import type { ConnectPointMoveData } from "./ConnectPointMoveData.js";

/**
 * Event fired when connection points are moved
 *
 * @property eventType - Type of the event
 * @property points - Data of the moved connection points
 */
export type ConnectPointsMoveEvent = {
	eventId: string;
	eventType: EventType;
	points: ConnectPointMoveData[];
};
