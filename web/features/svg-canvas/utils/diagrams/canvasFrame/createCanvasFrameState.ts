import { CanvasFrameDefaultState } from "../../../constants/state/diagrams/CanvasFrameDefaultState";
import type { CanvasFrameState } from "../../../types/state/diagrams/CanvasFrameState";
import { newId } from "../../shapes/common/newId";

/**
 * Create CanvasFrame state
 */
export const createCanvasFrameState = ({
	x,
	y,
}: {
	x: number;
	y: number;
}): CanvasFrameState => ({
	...CanvasFrameDefaultState,
	id: newId(),
	x,
	y,
});