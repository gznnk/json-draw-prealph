// Import types.
import type { ButtonState } from "../../../types/state/elements/ButtonState";

// Import constants.
import { ButtonDefaultState } from "../../../constants/state/elements/ButtonDefaultState";

// Import utils.
import { newId } from "../../shapes/common/newId";

/**
 * Create Button state
 */
export const createButtonState = ({ x, y }: { x: number; y: number }): ButtonState => ({
	...ButtonDefaultState,
	id: newId(),
	x,
	y,
});