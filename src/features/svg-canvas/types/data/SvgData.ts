import type { CreateDataType } from "./CreateDataType";

/**
 * Type for the data of the Svg component.
 */
export type SvgData = CreateDataType<{
	selectable: true;
	transformative: true;
}> & {
	initialWidth: number;
	initialHeight: number;
	svgText: string;
};
