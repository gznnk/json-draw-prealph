// Import utils.
import { createRectangleState } from "../../shapes/rectangle/createRectangleState";

// Import constants.
import { DefaultTextAreaNodeState } from "../../../constants/state/nodes/DefaultTextAreaNodeState";

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
}: {
	x: number;
	y: number;
}) => {
	const state = createRectangleState({
		x,
		y,
		width: DefaultTextAreaNodeState.width,
		height: DefaultTextAreaNodeState.height,
		radius: DefaultTextAreaNodeState.radius,
		stroke: DefaultTextAreaNodeState.stroke,
		strokeWidth: DefaultTextAreaNodeState.strokeWidth,
		fill: DefaultTextAreaNodeState.fill,
		textType: DefaultTextAreaNodeState.textType,
		textAlign: DefaultTextAreaNodeState.textAlign,
		verticalAlign: DefaultTextAreaNodeState.verticalAlign,
		fontSize: DefaultTextAreaNodeState.fontSize,
		fontColor: DefaultTextAreaNodeState.fontColor,
	});

	state.type = "TextAreaNode";

	return state;
};