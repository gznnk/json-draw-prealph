// Import types.
import type { DiagramConnectEvent } from "../../events/DiagramConnectEvent";
import type { PreviewConnectLineEvent } from "../../events/PreviewConnectLineEvent";

/**
 * Interface for diagram elements that can have connection points.
 * Note: Connectable functionality is primarily handled through ConnectableData/State in shapes.
 */

/**
 * Props for connectable component.
 *
 * @property {function} onConnect        - Event handler for diagram connection.
 *                                         The connectable component must trigger this event when a connection is made.
 * @property {function} onPreviewConnectLine - Event handler for preview connection line changes.
 *                                              The connectable component must trigger this event when the preview connection line should be updated.
 */
export type ConnectableProps = {
	onConnect?: (e: DiagramConnectEvent) => void;
	onPreviewConnectLine?: (e: PreviewConnectLineEvent) => void;
};
