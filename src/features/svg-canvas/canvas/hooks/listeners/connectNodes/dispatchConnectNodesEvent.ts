// Import types related to SvgCanvas.
import type { ConnectNodesEvent } from "../../../../types/events/ConnectNodesEvent";

// Imports related to this component.
import { CONNECT_NODES_EVENT_NAME } from "./connectNodesConstants";

/**
 * Dispatch the specified ConnectNodesEvent to the window.
 */
export const dispatchConnectNodesEvent = (e: ConnectNodesEvent) => {
	const event = new CustomEvent(CONNECT_NODES_EVENT_NAME, {
		detail: e,
	});
	window.dispatchEvent(event);
};
