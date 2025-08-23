// Import utils.
import { createRectangleState } from "../../shapes/rectangle/createRectangleState";

// Import constants.
import { TextAreaNodeDefaultState } from "../../../constants/state/nodes/TextAreaNodeDefaultState";

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
}: {
	x: number;
	y: number;
	width: number;
	height: number;
}) => {
	const state = createRectangleState({
		...TextAreaNodeDefaultState,
		x,
		y,
		width,
		height,
	});

	state.type = "TextAreaNode";

	return state;
};
