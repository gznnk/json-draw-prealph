import type {
	CreateDataType,
	CreateDiagramProps,
	CreateStateType,
} from "./CreateDiagramTypes";

/**
 * Type for the data of the Svg component.
 */
export type SvgData = CreateDataType<{
	transformative: true;
}> & {
	initialWidth: number;
	initialHeight: number;
	svgText: string;
};

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
