// Import types related to SvgCanvas.
import type { CreateDiagramProps } from "./CreateDiagramProps";
import type { SvgState } from "../../state/shapes/SvgState";

/**
 * Props for the Svg component.
 */
export type SvgProps = CreateDiagramProps<
	SvgState,
	{
		selectable: true;
		transformative: true;
	}
>;
