// Import types.
import type { ButtonData } from "../../../types/data/diagrams/ButtonData";

// Import constants.
import { ButtonFeatures } from "../../../types/data/diagrams/ButtonData";
import { CreateDefaultData } from "../shapes/CreateDefaultData";

/**
 * Default data values for Button
 */
export const ButtonDefaultData: ButtonData = CreateDefaultData<ButtonData>({
	type: "Button",
	options: ButtonFeatures,
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