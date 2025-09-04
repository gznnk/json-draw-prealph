// Import types.
import type { InputState } from "../../../types/state/elements/InputState";

// Import constants.
import { InputDefaultState } from "../../../constants/state/elements/InputDefaultState";

// Import utils.
import { newId } from "../../shapes/common/newId";

/**
 * Create Input state
 */
export const createInputState = ({
	x,
	y,
	text = "",
}: { x: number; y: number; text?: string }): InputState => ({
	...InputDefaultState,
	id: newId(),
	x,
	y,
	text,
});
