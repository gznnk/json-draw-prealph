// Import types.
import type { SvgData, SvgFeatures } from "../../data/shapes/SvgData";
import type { CreateStateType } from "./CreateStateType";

/**
 * Type for the state of the Svg component.
 */
export type SvgState = CreateStateType<
	SvgData,
	typeof SvgFeatures
>;