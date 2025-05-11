import type { Shape } from "../base";
import type { PathPointData } from "../../components/shapes/Path";
import type { EventType } from "./EventBaseTypes";

/**
 * Event fired when connecting two diagrams
 */
export type DiagramConnectEvent = {
	eventId: string;
	startOwnerId: string;
	points: PathPointData[];
	endOwnerId: string;
};

/**
 * Data structure for connection point movement
 *
 * @property id - ID of the moved connection point
 * @property name - Name of the connection point
 * @property x - Destination X coordinate
 * @property y - Destination Y coordinate
 * @property ownerId - ID of the owner of the connection point
 * @property ownerShape - Shape of the owner (used for redrawing connections; the shape of the
 *                       connection target's owner is retrieved within the connection line component)
 */
export type ConnectPointMoveData = {
	id: string;
	name: string;
	x: number;
	y: number;
	ownerId: string;
	ownerShape: Shape;
};

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

/**
 * Event fired when connecting two nodes in a diagram
 */
export type ConnectNodesEvent = {
	eventId: string;
	sourceNodeId: string;
	targetNodeId: string;
};
