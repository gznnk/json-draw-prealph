// Import types related to SvgCanvas.
import type {
	CreateDiagramType,
	CreateDiagramProps,
} from "../../../types/DiagramTypes";

/**
 * Type for the data of the Svg component.
 */
export type SvgData = CreateDiagramType<{
	selectable: true;
	transformative: true;
}> & {
	initialWidth: number;
	initialHeight: number;
	svgText: string;
};

/**
 * Props for the Svg component.
 */
export type SvgProps = CreateDiagramProps<
	SvgData,
	{
		selectable: true;
		transformative: true;
	}
>;
