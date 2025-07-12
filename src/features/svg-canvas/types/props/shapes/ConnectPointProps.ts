// Import types related to SvgCanvas.
import type { ConnectPointData } from "../../data/shapes/ConnectPointData";
import type { DiagramConnectEvent } from "../../events/DiagramConnectEvent";
import type { Shape } from "../../core/Shape";
import type { PreviewConnectLineEvent } from "../../events/PreviewConnectLineEvent";

/**
 * Connect point properties
 */
export type ConnectPointProps = Omit<ConnectPointData, "type"> & {
	ownerId: string;
	ownerShape: Shape; // Should be passed as memoized
	alwaysVisible: boolean; // Whether to always show the connect point, even when not hovered.
	onConnect?: (e: DiagramConnectEvent) => void;
	onPreviewConnectLine?: (e: PreviewConnectLineEvent) => void;
};
