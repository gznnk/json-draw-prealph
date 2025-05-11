import type { EventType } from "./EventType";
import type { ConnectPointMoveData } from "./ConnectPointMoveData";

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
