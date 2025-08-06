// Import utils.
import { createRectangleState } from "../../shapes/rectangle/createRectangleState";

// Import constants.
import { DefaultLLMNodeState } from "../../../constants/state/nodes/DefaultLLMNodeState";

/**
 * Creates state for an LLM node with specified properties.
 *
 * @param x - The x coordinate of the node
 * @param y - The y coordinate of the node
 * @param text - Optional text content of the node
 * @returns LLM node state object
 */
export const createLLMNodeState = ({
	x,
	y,
	text,
}: {
	x: number;
	y: number;
	text?: string;
}) => {
	const state = createRectangleState({
		x,
		y,
		stroke: DefaultLLMNodeState.stroke,
		fill: DefaultLLMNodeState.fill,
		textType: DefaultLLMNodeState.textType,
		textAlign: DefaultLLMNodeState.textAlign,
		verticalAlign: DefaultLLMNodeState.verticalAlign,
		fontColor: DefaultLLMNodeState.fontColor,
		fontSize: DefaultLLMNodeState.fontSize,
		text: text ?? DefaultLLMNodeState.text,
		keepProportion: DefaultLLMNodeState.keepProportion,
	});

	state.type = "LLMNode";

	return state;
};