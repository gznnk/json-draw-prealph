// Import types.
import type { SvgData } from "../../data/shapes/SvgData";
import type { CreateStateType } from "./CreateStateType";

/**
 * Type for the state of the Svg component.
 */
export type SvgState = CreateStateType<
	SvgData,
	{
		selectable: true;
		transformative: true;
	}
>;
