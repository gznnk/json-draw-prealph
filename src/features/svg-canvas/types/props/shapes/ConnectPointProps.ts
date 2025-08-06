// Import types.
import type { Shape } from "../../core/Shape";
import type { DiagramConnectEvent } from "../../events/DiagramConnectEvent";
import type { PreviewConnectLineEvent } from "../../events/PreviewConnectLineEvent";
import type { ConnectPointState } from "../../state/shapes/ConnectPointState";

/**
 * Connect point properties
 */
export type ConnectPointProps = Omit<ConnectPointState, "type"> & {
	ownerId: string;
	ownerShape: Shape; // Should be passed as memoized
	alwaysVisible: boolean; // Whether to always show the connect point, even when not hovered.
	onConnect?: (e: DiagramConnectEvent) => void;
	onPreviewConnectLine?: (e: PreviewConnectLineEvent) => void;
};
