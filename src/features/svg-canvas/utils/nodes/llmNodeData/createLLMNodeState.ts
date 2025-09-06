// Import types.
import type { LLMNodeState } from "../../../types/state/nodes/LLMNodeState";

// Import utils.
import { createInputState } from "../../elements/input/createInputState";
import { createNodeHeaderState } from "../../elements/nodeHeader/createNodeHeaderState";
import { newId } from "../../shapes/common/newId";
import { createRectangleConnectPoint } from "../../shapes/rectangle/createRectangleConnectPoint";

// Import constants.
import { LLMNodeDefaultState } from "../../../constants/state/nodes/LLMNodeDefaultState";

/**
 * Creates state for an LLM node with specified properties.
 *
 * @param x - The x coordinate of the node
 * @param y - The y coordinate of the node
 * @param width - Optional width of the node
 * @param height - Optional height of the node
 * @param rotation - Optional rotation of the node
 * @param scaleX - Optional x scale of the node
 * @param scaleY - Optional y scale of the node
 * @returns LLM node state object
 */
export const createLLMNodeState = ({
	x,
	y,
	width = LLMNodeDefaultState.width,
	height = LLMNodeDefaultState.height,
	rotation = 0,
	scaleX = 1,
	scaleY = 1,
	text = "",
}: {
	x: number;
	y: number;
	width?: number;
	height?: number;
	rotation?: number;
	scaleX?: number;
	scaleY?: number;
	text?: string;
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
		...LLMNodeDefaultState,
		id: newId(),
		x,
		y,
		width,
		height,
		rotation,
		scaleX,
		scaleY,
		items: [
			createNodeHeaderState({
				x,
				y,
				text: "LLM",
			}),
			{
				...createInputState({
					x,
					y,
					text,
					verticalAlign: "top",
				}),
				connectPoints: [],
			},
		],
		connectPoints,
	} as LLMNodeState;

	return state;
};
