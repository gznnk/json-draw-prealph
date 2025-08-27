// Import types.
import type { ButtonState } from "../../../types/state/elements/ButtonState";

// Import constants.
import { ButtonDefaultData } from "../../data/elements/ButtonDefaultData";
import { ButtonFeatures } from "../../../types/data/elements/ButtonData";
import { CreateDefaultState } from "../shapes/CreateDefaultState";

/**
 * Default state values for Button
 */
export const ButtonDefaultState: ButtonState = CreateDefaultState<ButtonState>({
	type: "Button",
	options: ButtonFeatures,
	baseData: ButtonDefaultData,
	properties: {
		borderRadius: 6,
		width: 88,
		height: 32,
		fill: "#1677ff",
		stroke: "#1677ff",
		strokeWidth: 1,
		text: "Button",
		fontSize: 14,
		fontColor: "#ffffff",
		fontWeight: "normal",
	},
});