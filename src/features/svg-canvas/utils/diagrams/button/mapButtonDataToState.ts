// Import constants.
import { ButtonDefaultState } from "../../../constants/state/diagrams/ButtonDefaultState";
import type { ButtonState } from "../../../types/state/diagrams/ButtonState";

// Import utils.
import { createDataToStateMapper } from "../../core/createDataToStateMapper";

export const mapButtonDataToState = createDataToStateMapper<ButtonState>(
	ButtonDefaultState,
);