// Import types.
import type { ImageGenNodeState } from "../../../types/state/nodes/ImageGenNodeState";

// Import utils.
import { newId } from "../../shapes/common/newId";
import { createRectangleConnectPoint } from "../../shapes/rectangle/createRectangleConnectPoint";

// Import constants.
import { DefaultImageGenNodeState } from "../../../constants/state/nodes/DefaultImageGenNodeState";

/**
 * Creates state for an ImageGen node with specified properties.
 *
 * @param x - The x coordinate of the node
 * @param y - The y coordinate of the node
 * @returns ImageGen node state object
 */
export const createImageGenNodeState = ({
	x,
	y,
}: {
	x: number;
	y: number;
}) => {
	const connectPoints = createRectangleConnectPoint({
		x,
		y,
		width: DefaultImageGenNodeState.width,
		height: DefaultImageGenNodeState.height,
		rotation: DefaultImageGenNodeState.rotation,
		scaleX: DefaultImageGenNodeState.scaleX,
		scaleY: DefaultImageGenNodeState.scaleY,
	});

	return {
		...DefaultImageGenNodeState,
		id: newId(),
		x,
		y,
		connectPoints,
	} as ImageGenNodeState;
};