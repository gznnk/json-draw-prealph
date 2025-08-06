// Import types.
import type { SvgToDiagramNodeState } from "../../../types/state/nodes/SvgToDiagramNodeState";

// Import utils.
import { createRectangleConnectPoint } from "../../shapes/rectangle/createRectangleConnectPoint";
import { newId } from "../../shapes/common/newId";

// Import constants.
import { DefaultSvgToDiagramNodeState } from "../../../constants/state/nodes/DefaultSvgToDiagramNodeState";

/**
 * Creates state for a SvgToDiagram node with specified properties.
 *
 * @param x - The x coordinate of the node
 * @param y - The y coordinate of the node
 * @returns SvgToDiagram node state object
 */
export const createSvgToDiagramNodeState = ({
	x,
	y,
}: {
	x: number;
	y: number;
}) => {
	const connectPoints = createRectangleConnectPoint({
		x,
		y,
		width: DefaultSvgToDiagramNodeState.width,
		height: DefaultSvgToDiagramNodeState.height,
		rotation: DefaultSvgToDiagramNodeState.rotation,
		scaleX: DefaultSvgToDiagramNodeState.scaleX,
		scaleY: DefaultSvgToDiagramNodeState.scaleY,
	});

	return {
		...DefaultSvgToDiagramNodeState,
		id: newId(),
		x,
		y,
		connectPoints,
	} as SvgToDiagramNodeState;
};