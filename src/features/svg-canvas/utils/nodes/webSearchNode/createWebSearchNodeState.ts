// Import types.
import type { WebSearchNodeState } from "../../../types/state/nodes/WebSearchNodeState";

// Import utils.
import { newId } from "../../shapes/common/newId";
import { createRectangleConnectPoint } from "../../shapes/rectangle/createRectangleConnectPoint";

// Import constants.
import { DefaultWebSearchNodeState } from "../../../constants/state/nodes/DefaultWebSearchNodeState";

/**
 * Creates state for a WebSearch node with specified properties.
 *
 * @param x - The x coordinate of the node
 * @param y - The y coordinate of the node
 * @returns WebSearch node state object
 */
export const createWebSearchNodeState = ({
	x,
	y,
}: {
	x: number;
	y: number;
}) => {
	const connectPoints = createRectangleConnectPoint({
		x,
		y,
		width: DefaultWebSearchNodeState.width,
		height: DefaultWebSearchNodeState.height,
		rotation: DefaultWebSearchNodeState.rotation,
		scaleX: DefaultWebSearchNodeState.scaleX,
		scaleY: DefaultWebSearchNodeState.scaleY,
	});

	return {
		...DefaultWebSearchNodeState,
		id: newId(),
		x,
		y,
		connectPoints,
	} as WebSearchNodeState;
};