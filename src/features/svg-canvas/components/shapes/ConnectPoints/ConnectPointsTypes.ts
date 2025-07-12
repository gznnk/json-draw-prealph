import type { ConnectPointData } from "../../../types/data/shapes/ConnectPointData";
import type { DiagramConnectEvent } from "../../../types/events/DiagramConnectEvent";
import type { PreviewConnectLineEvent } from "../../../types/events/PreviewConnectLineEvent";
import type { Shape } from "../../../types/core/Shape";

/**
 * Props for ConnectPoints component
 */
export type ConnectPointsProps = {
	/** Owner shape ID */
	ownerId: string;
	/** Owner shape properties */
	ownerShape: Shape;
	/** Array of connect points to render */
	connectPoints: ConnectPointData[];
	/** Whether to show all connect points */
	showConnectPoints: boolean;
	/** Whether to render connect points at all */
	shouldRender: boolean;
	/** Connect event handler */
	onConnect?: (event: DiagramConnectEvent) => void;
	/** Preview connect line event handler */
	onPreviewConnectLine?: (event: PreviewConnectLineEvent) => void;
};
