// Import types.
import type { TextAreaNodeState } from "../../../types/state/nodes/TextAreaNodeState";

// Import constants.
import { TextAreaNodeDefaultState } from "../../../constants/state/nodes/TextAreaNodeDefaultState";

// Import utils.
import { createInputState } from "../../elements/input/createInputState";
import { newId } from "../../shapes/common/newId";
import { createRectangleConnectPoint } from "../../shapes/rectangle/createRectangleConnectPoint";

/**
 * Creates state for a TextArea node with specified properties.
 *
 * @param x - The x coordinate of the node
 * @param y - The y coordinate of the node
 * @returns TextArea node state object
 */
export const createTextAreaNodeState = ({
	x,
	y,
	width = 200,
	height = 100,
	rotation = 0,
	scaleX = 1,
	scaleY = 1,
}: {
	x: number;
	y: number;
	width?: number;
	height?: number;
	rotation?: number;
	scaleX?: number;
	scaleY?: number;
}) => {
	const connectPoints = createRectangleConnectPoint({
		x,
		y,
		width,
		height,
		rotation,
		scaleX,
		scaleY,
	});

	const state = {
		...TextAreaNodeDefaultState,
		id: newId(),
		x,
		y,
		width,
		height,
		rotation,
		scaleX,
		scaleY,
		items: [
			createInputState({
				x,
				y,
			}),
		],
		connectPoints,
	} as TextAreaNodeState;

	return state;
};
