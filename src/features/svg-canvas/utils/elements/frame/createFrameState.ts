// Import types.
import type { FrameState } from "../../../types/state/elements/FrameState";

// Import constants.
import { FrameDefaultState } from "../../../constants/state/elements/FrameDefaultState";

// Import utils.
import { newId } from "../../../utils/shapes/common/newId";

/**
 * Creates frame state with the specified properties.
 *
 * @param params - Frame parameters including position and dimensions.
 * @returns The created frame state object.
 */
export const createFrameState = ({
	x,
	y,
	width = 100,
	height = 100,
}: {
	x: number;
	y: number;
	width?: number;
	height?: number;
}): FrameState => {
	return {
		...FrameDefaultState,
		id: newId(),
		x,
		y,
		width,
		height,
	} as FrameState;
};