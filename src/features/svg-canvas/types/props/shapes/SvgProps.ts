// Import types related to SvgCanvas.
import type { CreateDiagramProps } from "./CreateDiagramProps";
import type { SvgState } from "../../state/shapes/SvgState";
import type { SvgFeatures } from "../../data/shapes/SvgData";

/**
 * Props for the Svg component.
 */
export type SvgProps = CreateDiagramProps<
	SvgState,
	typeof SvgFeatures
>;