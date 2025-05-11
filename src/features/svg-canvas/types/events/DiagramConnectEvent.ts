import type { PathPointData } from "../../components/shapes/Path";

/**
 * Event fired when connecting two diagrams
 */
export type DiagramConnectEvent = {
	eventId: string;
	startOwnerId: string;
	points: PathPointData[];
	endOwnerId: string;
};
