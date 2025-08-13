// Import types.
import type { VectorStoreNodeState } from "../../../types/diagrams/nodes/VectorStoreNodeTypes";

// Import utils.
import { newId } from "../../shapes/common/newId";
import { createRectangleConnectPoint } from "../../shapes/rectangle/createRectangleConnectPoint";

// Import constants.
import { DefaultVectorStoreNodeState } from "../../../constants/state/nodes/DefaultVectorStoreNodeState";

/**
 * Creates state for a VectorStore node with specified properties.
 *
 * @param x - The x coordinate of the node
 * @param y - The y coordinate of the node
 * @returns VectorStore node state object
 */
export const createVectorStoreNodeState = ({
	x,
	y,
}: {
	x: number;
	y: number;
}) => {
	const connectPoints = createRectangleConnectPoint({
		x,
		y,
		width: DefaultVectorStoreNodeState.width,
		height: DefaultVectorStoreNodeState.height,
		rotation: DefaultVectorStoreNodeState.rotation,
		scaleX: DefaultVectorStoreNodeState.scaleX,
		scaleY: DefaultVectorStoreNodeState.scaleY,
	});

	return {
		...DefaultVectorStoreNodeState,
		id: newId(),
		x,
		y,
		connectPoints,
	} as VectorStoreNodeState;
};
